import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dispatchEnquiryNotifications } from './notification-service.js';
import {
  getContentData,
  saveContentData,
  getSubmissionsData,
  saveSubmissionsData,
  getDatabaseStatus
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper to resolve files in project directories (handles dev source and prod dist folder)
const resolveFilePath = (filename) => {
  const devPath = path.resolve(__dirname, filename);
  if (fs.existsSync(path.dirname(devPath))) {
    return devPath;
  }
  return path.resolve(__dirname, filename.replace(/^public\//, 'dist/'));
};

// Rate limiting in-memory store: Map<ip, timestamps[]>
const rateLimitStore = new Map();

function rateLimiter(limit, windowMs, message) {
  return (req, res, next) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown-ip';
    const now = Date.now();
    const timestamps = rateLimitStore.get(ip) || [];

    // Retain timestamps within the window
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= limit) {
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests. Please try again later.'
      });
    }

    recent.push(now);
    rateLimitStore.set(ip, recent);
    next();
  };
}

// Clean old rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter(t => now - t < 3600000);
    if (valid.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, valid);
    }
  }
}, 600000);

// Admin configuration derived purely from environment variables
const getAdminConfig = () => {
  const username = (process.env.ADMIN_USERNAME || 'admin').trim();
  let passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash && process.env.ADMIN_PASSWORD) {
    // Generate bcrypt hash dynamically from environment plain-text password
    passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD.trim(), 10);
  }

  // Fallback check: in strict production, notify if password is not configured
  if (!passwordHash) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[AUTH WARNING] ⚠️ ADMIN_PASSWORD or ADMIN_PASSWORD_HASH is not set in environment variables! Please configure it in your production dashboard.');
    }
    // Safe development placeholder hash (matches default local .env)
    passwordHash = '$2b$10$Ax/mDEHyNZebu238qTI49.IDydv.MdIParIe05MoeJL6Qchsv/sCW';
  }

  const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production'
    ? null
    : 'aps_dev_fallback_session_key_2026');

  return { username, passwordHash, jwtSecret };
};

// Helper for cookie options tailored to production HTTPS & cross-origin requirements
const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const frontendUrl = process.env.FRONTEND_URL || '';
  const isCrossOrigin = frontendUrl && !frontendUrl.includes('localhost') && !frontendUrl.includes('127.0.0.1');

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd && isCrossOrigin) ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  };
};

// Middleware to authenticate JWT token from Cookies or Authorization header
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = req.cookies?.token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Please log in.' });
  }

  const { jwtSecret } = getAdminConfig();
  if (!jwtSecret) {
    console.error('[AUTH ERROR] JWT_SECRET is not configured in environment variables.');
    return res.status(500).json({ success: false, message: 'Server authentication configuration missing (JWT_SECRET).' });
  }

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

// Configure Multer for secure File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = resolveFilePath('public/uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename to prevent directory traversal and arbitrary script execution
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'media-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.webm', '.pdf'];
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm',
    'application/pdf'
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only standard images (JPG, PNG, WEBP, GIF), videos (MP4, WEBM), and PDF documents are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB file size limit
});

// ------------------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------------------

// 0. HEALTH CHECK
router.get('/health', (req, res) => {
  const dbStatus = getDatabaseStatus();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// 1. ADMIN LOGIN (Rate limited: 10 attempts per 15 minutes)
router.post('/login', rateLimiter(10, 15 * 60 * 1000, 'Too many login attempts. Please wait 15 minutes before trying again.'), (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
  }

  const { username: validUsername, passwordHash, jwtSecret } = getAdminConfig();

  if (!jwtSecret) {
    return res.status(500).json({ success: false, message: 'Server configuration error: JWT_SECRET not set.' });
  }

  // Constant-time check for username match
  if (username.toLowerCase() !== validUsername.toLowerCase()) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  const passValid = bcrypt.compareSync(password, passwordHash);
  if (!passValid) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  // Clear rate limit for this IP on successful login
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown-ip';
  rateLimitStore.delete(ip);

  const token = jwt.sign({ username: validUsername }, jwtSecret, { expiresIn: '1d' });

  // Set secure HTTP-only Cookie
  res.cookie('token', token, getCookieOptions());

  res.json({
    success: true,
    token,
    username: validUsername,
    message: 'Login successful.'
  });
});

// 2. ADMIN LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token', getCookieOptions());
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 3. CHECK SESSION
router.get('/check-session', authenticateToken, (req, res) => {
  res.json({ success: true, username: req.user.username });
});

// 4. GET CONTENT
router.get('/content', async (req, res) => {
  try {
    const data = await getContentData();
    res.json(data);
  } catch (err) {
    console.error('Error fetching website content:', err);
    res.status(500).json({ success: false, message: 'Error retrieving website content.' });
  }
});

// 5. SAVE CONTENT (Protected)
router.post('/save-content', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid content payload.' });
    }

    await saveContentData(data);
    res.json({ success: true, message: 'Content updated successfully.' });
  } catch (err) {
    console.error('Error saving content:', err);
    res.status(500).json({ success: false, message: 'Error saving website content.' });
  }
});

// 6. UPLOAD MEDIA (Protected)
router.post('/upload', authenticateToken, (req, res) => {
  upload.array('files', 10)(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files selected for upload.' });
    }

    const uploadedFiles = req.files.map(file => {
      const url = '/uploads/' + file.filename;

      const devUploadDir = path.resolve(__dirname, 'public/uploads/');
      const prodUploadDir = path.resolve(__dirname, 'dist/uploads/');

      // Mirror file to both directories if both exist
      if (fs.existsSync(devUploadDir) && fs.existsSync(prodUploadDir)) {
        const devFile = path.join(devUploadDir, file.filename);
        const prodFile = path.join(prodUploadDir, file.filename);

        if (file.path === devFile && !fs.existsSync(prodFile)) {
          fs.copyFileSync(devFile, prodFile);
        } else if (file.path === prodFile && !fs.existsSync(devFile)) {
          fs.copyFileSync(prodFile, devFile);
        }
      }

      return {
        name: file.filename,
        originalName: file.originalname,
        url: url,
        size: file.size,
        date: new Date().toISOString()
      };
    });

    res.json({ success: true, files: uploadedFiles });
  });
});

// 7. GET MEDIA LIBRARY ITEMS (Protected)
router.get('/media', authenticateToken, (req, res) => {
  try {
    const uploadDir = resolveFilePath('public/uploads/');
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(uploadDir);
    const mediaList = files
      .filter(file => !file.startsWith('.') && /^[a-zA-Z0-9_.-]+$/.test(file))
      .map(file => {
        const filePath = path.join(uploadDir, file);
        try {
          const stats = fs.statSync(filePath);
          return {
            name: file,
            url: '/uploads/' + file,
            size: stats.size,
            date: stats.mtime.toISOString()
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

    res.json(mediaList);
  } catch (err) {
    console.error('Error listing media items:', err);
    res.status(500).json({ success: false, message: 'Error listing media files.' });
  }
});

// 8. DELETE MEDIA (Protected)
router.delete('/media/:name', authenticateToken, (req, res) => {
  try {
    const filename = req.params.name;

    // Strict validation against path traversal
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\') || !/^[a-zA-Z0-9_.-]+$/.test(filename)) {
      return res.status(400).json({ success: false, message: 'Invalid or unauthorized file name.' });
    }

    const uploadDir = resolveFilePath('public/uploads/');
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Mirror deletion to dist/uploads if it exists
    const prodFilePath = path.resolve(__dirname, 'dist/uploads/', filename);
    if (fs.existsSync(prodFilePath)) {
      fs.unlinkSync(prodFilePath);
    }

    res.json({ success: true, message: 'File deleted successfully.' });
  } catch (err) {
    console.error('Error deleting media file:', err);
    res.status(500).json({ success: false, message: 'Error deleting media file.' });
  }
});

// 9. GET SUBMISSIONS (Protected)
router.get('/submissions', authenticateToken, async (req, res) => {
  try {
    const submissions = await getSubmissionsData();
    res.json(submissions);
  } catch (err) {
    console.error('Error reading submissions:', err);
    res.status(500).json({ success: false, message: 'Error reading submissions.' });
  }
});

// 10. PUBLIC SUBMISSION: ADMISSION ENQUIRY
// Rate limit: max 10 per hour per IP with duplicate protection and async notifications
router.post('/enquiry', rateLimiter(10, 60 * 60 * 1000, 'Too many enquiry requests. Please wait before submitting again.'), async (req, res) => {
  try {
    const { parentName, studentName, phoneNumber, classApply, email, message } = req.body;

    if (!parentName || !studentName || !phoneNumber || !classApply) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    // Strictly validate 10-digit Indian phone number
    const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }

    const submissions = await getSubmissionsData();
    submissions.enquiries = submissions.enquiries || [];
    submissions.messages = submissions.messages || [];

    // DUPLICATE CHECK: Prevent double submits within 3 minutes
    const nowMs = Date.now();
    const isDuplicate = submissions.enquiries.some(e => {
      if (e.phone === cleanPhone && String(e.student_name).toLowerCase().trim() === String(studentName).toLowerCase().trim()) {
        const enqTime = new Date(e.date).getTime();
        return (nowMs - enqTime) < (3 * 60 * 1000);
      }
      return false;
    });

    if (isDuplicate) {
      return res.json({
        success: true,
        message: 'Your admission enquiry has already been received! Our admissions desk will contact you shortly.',
        duplicate_prevented: true
      });
    }

    const newEnquiry = {
      id: 'enq-' + nowMs,
      parent_name: parentName.trim(),
      student_name: studentName.trim(),
      phone: cleanPhone,
      email: (email || '').trim(),
      class_apply: classApply,
      message: (message || '').trim(),
      status: 'new',
      date: new Date().toISOString(),
      follow_up_date: null,
      notes: [],
      history: [
        {
          action: 'created',
          status: 'new',
          note: 'Enquiry submitted via website form',
          date: new Date().toISOString()
        }
      ],
      notification_status: {
        whatsapp: { director: { status: 'queued' }, principal: { status: 'queued' } },
        sms: { director: { status: 'queued' }, principal: { status: 'queued' } }
      }
    };

    submissions.enquiries.unshift(newEnquiry); // Newest first
    await saveSubmissionsData(submissions);

    // Fetch contact settings for default admin phone numbers
    let defaultContacts = {};
    try {
      const contentData = await getContentData();
      defaultContacts = {
        directorPhone: contentData.contact_settings?.director_phone || contentData.director_info?.phone,
        principalPhone: contentData.contact_settings?.principal_phone || contentData.principal_info?.phone
      };
    } catch {}

    // Dispatch WhatsApp & SMS notifications asynchronously without blocking user response
    dispatchEnquiryNotifications(newEnquiry, defaultContacts)
      .then(async (report) => {
        try {
          const currentSubs = await getSubmissionsData();
          const target = currentSubs.enquiries.find(e => e.id === newEnquiry.id);
          if (target) {
            target.notification_status = report;
            await saveSubmissionsData(currentSubs);
          }
        } catch (dbErr) {
          console.error('[NOTIFY] Error saving notification status report:', dbErr.message);
        }
      })
      .catch((notifyErr) => {
        console.error('[NOTIFY] Notification dispatch error:', notifyErr.message);
      });

    res.json({
      success: true,
      message: 'Enquiry submitted successfully. Our admissions desk will contact you shortly.'
    });
  } catch (err) {
    console.error('Server error processing enquiry:', err);
    res.status(500).json({ success: false, message: 'Server error processing admission enquiry.' });
  }
});

// 11. PUBLIC SUBMISSION: CONTACT MESSAGE
router.post('/contact', rateLimiter(10, 60 * 60 * 1000, 'Too many messages sent. Please wait before submitting again.'), async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    const submissions = await getSubmissionsData();
    submissions.enquiries = submissions.enquiries || [];
    submissions.messages = submissions.messages || [];

    // Duplicate check for double clicks within 2 minutes
    const nowMs = Date.now();
    const isDuplicate = submissions.messages.some(m => {
      if (String(m.name).toLowerCase().trim() === String(name).toLowerCase().trim() && m.message === String(message).trim()) {
        const msgTime = new Date(m.date).getTime();
        return (nowMs - msgTime) < (2 * 60 * 1000);
      }
      return false;
    });

    if (isDuplicate) {
      return res.json({
        success: true,
        message: 'Your message has already been received! We will respond shortly.',
        duplicate_prevented: true
      });
    }

    const newMsg = {
      id: 'msg-' + nowMs,
      name: name.trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      is_read: false,
      status: 'new',
      date: new Date().toISOString()
    };

    submissions.messages.unshift(newMsg); // Newest first
    await saveSubmissionsData(submissions);

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Server error processing contact message:', err);
    res.status(500).json({ success: false, message: 'Server error processing message.' });
  }
});

// 12. UPDATE SUBMISSION STATUS / READ STATE (Protected)
router.post('/update-submission', authenticateToken, async (req, res) => {
  try {
    const { type, id, status, is_read, follow_up_date } = req.body;

    if (!type || !id || (type !== 'enquiry' && type !== 'message')) {
      return res.status(400).json({ success: false, message: 'Invalid parameters.' });
    }

    const submissions = await getSubmissionsData();

    if (type === 'enquiry') {
      const item = submissions.enquiries.find(e => e.id === id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Enquiry not found.' });
      }

      let normalizedStatus = status;
      if (status === 'completed') normalizedStatus = 'converted';

      if (normalizedStatus && item.status !== normalizedStatus) {
        const oldStatus = item.status;
        item.status = normalizedStatus;
        item.history = item.history || [];
        item.history.push({
          action: 'status_change',
          from: oldStatus,
          to: normalizedStatus,
          date: new Date().toISOString(),
          by: req.user?.username || 'Admin'
        });
      }

      if (follow_up_date !== undefined) {
        item.follow_up_date = follow_up_date;
      }
    } else {
      const item = submissions.messages.find(m => m.id === id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }

      if (status) {
        item.status = status;
        item.is_read = (status !== 'new');
      } else if (is_read !== undefined) {
        item.is_read = is_read;
        if (!is_read && item.status === 'read') {
          item.status = 'new';
        } else if (is_read && item.status === 'new') {
          item.status = 'read';
        }
      }
    }

    await saveSubmissionsData(submissions);
    res.json({ success: true, message: 'Submission updated successfully.' });
  } catch (err) {
    console.error('Error updating submission:', err);
    res.status(500).json({ success: false, message: 'Error updating submission.' });
  }
});

// 13. ADD FOLLOW-UP NOTE / DATE (Protected)
router.post('/enquiry-note', authenticateToken, async (req, res) => {
  try {
    const { id, noteText, followUpDate, status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Enquiry ID is required.' });
    }

    const submissions = await getSubmissionsData();
    const item = submissions.enquiries.find(e => e.id === id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    item.notes = item.notes || [];
    item.history = item.history || [];

    const now = new Date().toISOString();
    const adminUser = req.user?.username || 'Admin';

    if (noteText && noteText.trim()) {
      item.notes.push({
        text: noteText.trim(),
        author: adminUser,
        date: now
      });
      item.history.push({
        action: 'note_added',
        note: noteText.trim(),
        by: adminUser,
        date: now
      });
    }

    if (followUpDate !== undefined) {
      item.follow_up_date = followUpDate;
      item.history.push({
        action: 'follow_up_date_set',
        date_set: followUpDate,
        by: adminUser,
        date: now
      });
    }

    if (status && item.status !== status) {
      const oldStatus = item.status;
      item.status = status;
      item.history.push({
        action: 'status_change',
        from: oldStatus,
        to: status,
        by: adminUser,
        date: now
      });
    }

    await saveSubmissionsData(submissions);
    res.json({ success: true, message: 'Follow-up saved successfully.', enquiry: item });
  } catch (err) {
    console.error('Error adding enquiry note:', err);
    res.status(500).json({ success: false, message: 'Error adding enquiry note.' });
  }
});

// 14. DELETE SUBMISSION (Protected)
router.delete('/submission', authenticateToken, async (req, res) => {
  try {
    const { type, id } = req.body;

    if (!type || !id || (type !== 'enquiry' && type !== 'message')) {
      return res.status(400).json({ success: false, message: 'Invalid parameters.' });
    }

    const submissions = await getSubmissionsData();

    if (type === 'enquiry') {
      submissions.enquiries = submissions.enquiries.filter(e => e.id !== id);
    } else {
      submissions.messages = submissions.messages.filter(m => m.id !== id);
    }

    await saveSubmissionsData(submissions);
    res.json({ success: true, message: 'Submission deleted successfully.' });
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ success: false, message: 'Error deleting submission.' });
  }
});

export default router;
export { authenticateToken };
