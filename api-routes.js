import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dispatchEnquiryNotifications } from './notification-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper to find files in project directories (handles both dev source and prod dist folder)
const resolveFilePath = (filename) => {
  const devPath = path.resolve(__dirname, filename);
  if (fs.existsSync(path.dirname(devPath))) {
    return devPath;
  }
  return path.resolve(__dirname, filename.replace(/^public\//, 'dist/'));
};

const CONTENT_FILE = resolveFilePath('public/data/content.json');
const SUBMISSIONS_FILE = resolveFilePath('public/data/submissions.json');
const CONFIG_FILE = path.resolve(__dirname, 'admin-config.json');

// In-memory rate limiting map: { ip: [timestamps] }
const rateLimitStore = new Map();

function rateLimiter(limit, windowMs, message) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const timestamps = rateLimitStore.get(ip) || [];

    // Filter timestamps within window
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

// Helper to save JSON databases to both public/ and dist/ to ensure sync
const writeDatabase = (filename, data) => {
  const isContent = filename.includes('content.json');
  const relPath = isContent ? 'data/content.json' : 'data/submissions.json';
  
  const devPath = path.resolve(__dirname, 'public/' + relPath);
  const prodPath = path.resolve(__dirname, 'dist/' + relPath);
  let written = false;
  
  if (fs.existsSync(path.dirname(devPath))) {
    fs.writeFileSync(devPath, JSON.stringify(data, null, 2), 'utf-8');
    written = true;
  }
  if (fs.existsSync(path.dirname(prodPath))) {
    fs.writeFileSync(prodPath, JSON.stringify(data, null, 2), 'utf-8');
    written = true;
  }
  
  if (!written) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
  }
};

// Read config with environment variable overrides
const getConfig = () => {
  let configData = {
    username: 'Azmi',
    passwordHash: '$2b$10$Ax/mDEHyNZebu238qTI49.IDydv.MdIParIe05MoeJL6Qchsv/sCW', // azmi@12345
    jwtSecret: 'amrid_public_school_super_secret_session_key_2026'
  };

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      configData = { ...configData, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) };
    }
  } catch (err) {
    console.error('Error reading admin config:', err);
  }

  // Allow environment variables to securely override file config
  return {
    username: process.env.ADMIN_USERNAME || configData.username,
    passwordHash: process.env.ADMIN_PASSWORD_HASH || configData.passwordHash,
    jwtSecret: process.env.JWT_SECRET || configData.jwtSecret
  };
};

const config = getConfig();

// Middleware to authenticate JWT token from Cookies or Authorization header
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Please log in.' });
  }

  try {
    const verified = jwt.verify(token, config.jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = resolveFilePath('public/uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'media-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.webm', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos and PDF documents are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// 1. ADMIN LOGIN (with Rate Limiting: 15 attempts per 15 minutes)
router.post('/login', rateLimiter(15, 15 * 60 * 1000, 'Too many login attempts. Please wait 15 minutes.'), (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();

  console.log(`[AUTH] Login attempt received. Username: "${username}"`);

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
  }

  if (username.toLowerCase() !== config.username.toLowerCase()) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  const passValid = bcrypt.compareSync(password, config.passwordHash);

  if (!passValid) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  // Clear rate limit for this IP on successful login
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  rateLimitStore.delete(ip);

  const token = jwt.sign({ username: config.username }, config.jwtSecret, { expiresIn: '1d' });

  // Set HTTP-only Cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Set to true if running strictly on HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.json({ success: true, token, username: config.username });
});

// 2. ADMIN LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 3. CHECK SESSION
router.get('/check-session', authenticateToken, (req, res) => {
  res.json({ success: true, username: req.user.username });
});

// 4. GET CONTENT
router.get('/content', (req, res) => {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
      res.json(data);
    } else {
      res.status(404).json({ success: false, message: 'Content file not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error reading content data.' });
  }
});

// 5. SAVE CONTENT
router.post('/save-content', authenticateToken, (req, res) => {
  try {
    const data = req.body;
    
    // Save dynamically to public and dist
    writeDatabase(CONTENT_FILE, data);

    res.json({ success: true, message: 'Content updated successfully.' });
  } catch (err) {
    console.error('Error saving content:', err);
    res.status(500).json({ success: false, message: 'Error saving content data.' });
  }
});

// 6. UPLOAD MEDIA
router.post('/upload', authenticateToken, (req, res) => {
  upload.array('files', 10)(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    const uploadedFiles = req.files.map(file => {
      const url = '/uploads/' + file.filename;
      
      const devUploadDir = path.resolve(__dirname, 'public/uploads/');
      const prodUploadDir = path.resolve(__dirname, 'dist/uploads/');
      
      // Mirror to both directories if they both exist to ensure sync
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

// 7. GET MEDIA LIBRARY ITEMS
router.get('/media', authenticateToken, (req, res) => {
  try {
    const uploadDir = resolveFilePath('public/uploads/');
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(uploadDir);
    const mediaList = files
      .filter(file => !file.startsWith('.'))
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          url: '/uploads/' + file,
          size: stats.size,
          date: stats.mtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

    res.json(mediaList);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error listing media files.' });
  }
});

// 8. DELETE MEDIA
router.delete('/media/:name', authenticateToken, (req, res) => {
  try {
    const filename = req.params.name;
    // Path traversal protection
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ success: false, message: 'Invalid file name.' });
    }

    const uploadDir = resolveFilePath('public/uploads/');
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Mirror delete to dist/uploads if it exists
    if (uploadDir.includes('public/uploads/')) {
      const prodFilePath = path.resolve(__dirname, 'dist/uploads/', filename);
      if (fs.existsSync(prodFilePath)) {
        fs.unlinkSync(prodFilePath);
      }
    }

    res.json({ success: true, message: 'File deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting file.' });
  }
});

// 9. GET SUBMISSIONS (Admission enquiries & contact messages)
router.get('/submissions', authenticateToken, (req, res) => {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
      res.json(submissions);
    } else {
      res.json({ enquiries: [], messages: [] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error reading submissions.' });
  }
});

// 10. PUBLIC SUBMISSION: ADMISSION ENQUIRY
// Rate limit: max 10 per hour per IP. Includes duplicate check and async WhatsApp/SMS notifications.
router.post('/enquiry', rateLimiter(10, 60 * 60 * 1000, 'Too many enquiry requests. Please try again later.'), (req, res) => {
  try {
    const { parentName, studentName, phoneNumber, classApply, email, message } = req.body;

    if (!parentName || !studentName || !phoneNumber || !classApply) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    // Strictly validate 10 digit phone
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Invalid 10-digit phone number. Please enter a 10-digit mobile number.' });
    }

    // Read submissions
    let submissions = { enquiries: [], messages: [] };
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
      submissions.enquiries = submissions.enquiries || [];
      submissions.messages = submissions.messages || [];
    }

    // DUPLICATE CHECK: Check if an identical submission (same phone & student) was received in the last 3 minutes
    const nowMs = Date.now();
    const isDuplicate = submissions.enquiries.some(e => {
      if (e.phone === cleanPhone && e.student_name.toLowerCase() === studentName.trim().toLowerCase()) {
        const enqTime = new Date(e.date).getTime();
        return (nowMs - enqTime) < (3 * 60 * 1000); // 3 minutes window
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
      status: 'new', // new | contacted | follow-up | converted | closed
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

    submissions.enquiries.unshift(newEnquiry); // newest first
    writeDatabase(SUBMISSIONS_FILE, submissions);

    // Read contact settings for default admin phone numbers if present
    let defaultContacts = {};
    try {
      if (fs.existsSync(CONTENT_FILE)) {
        const contentData = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
        defaultContacts = {
          directorPhone: contentData.contact_settings?.director_phone || contentData.director_info?.phone,
          principalPhone: contentData.contact_settings?.principal_phone || contentData.principal_info?.phone
        };
      }
    } catch {}

    // Send WhatsApp & SMS notifications asynchronously without blocking user response
    dispatchEnquiryNotifications(newEnquiry, defaultContacts)
      .then(report => {
        // Update notification status safely in database
        try {
          if (fs.existsSync(SUBMISSIONS_FILE)) {
            const currentSubmissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
            const target = currentSubmissions.enquiries.find(e => e.id === newEnquiry.id);
            if (target) {
              target.notification_status = report;
              writeDatabase(SUBMISSIONS_FILE, currentSubmissions);
            }
          }
        } catch (dbErr) {
          console.error('[NOTIFY] Error saving notification status report:', dbErr);
        }
      })
      .catch(notifyErr => {
        console.error('[NOTIFY] Unhandled notification dispatch error:', notifyErr);
      });

    res.json({
      success: true,
      message: 'Enquiry submitted successfully. Our admissions desk will call you shortly on your provided phone number.'
    });
  } catch (err) {
    console.error('Server error processing enquiry:', err);
    res.status(500).json({ success: false, message: 'Server error processing enquiry.' });
  }
});

// 11. PUBLIC SUBMISSION: CONTACT MESSAGE
router.post('/contact', rateLimiter(10, 60 * 60 * 1000, 'Too many messages sent. Please wait before trying again.'), (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    let submissions = { enquiries: [], messages: [] };
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
      submissions.enquiries = submissions.enquiries || [];
      submissions.messages = submissions.messages || [];
    }

    // Duplicate check for accidental clicks within 2 minutes
    const nowMs = Date.now();
    const isDuplicate = submissions.messages.some(m => {
      if (m.name.toLowerCase() === name.trim().toLowerCase() && m.message === message.trim()) {
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
      status: 'new', // new | read | replied | closed
      date: new Date().toISOString()
    };

    submissions.messages.unshift(newMsg); // newest first
    writeDatabase(SUBMISSIONS_FILE, submissions);

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error processing message.' });
  }
});

// 12. UPDATE SUBMISSION STATUS / READ STATE
router.post('/update-submission', authenticateToken, (req, res) => {
  try {
    const { type, id, status, is_read, follow_up_date } = req.body;

    if (!type || !id || (type !== 'enquiry' && type !== 'message')) {
      return res.status(400).json({ success: false, message: 'Invalid params.' });
    }

    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return res.status(404).json({ success: false, message: 'No submissions found.' });
    }

    const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));

    if (type === 'enquiry') {
      const item = submissions.enquiries.find(e => e.id === id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Enquiry not found.' });
      }

      // Normalise status (support 'completed' as alias for 'converted')
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

    writeDatabase(SUBMISSIONS_FILE, submissions);
    res.json({ success: true, message: 'Submission updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating submission.' });
  }
});

// 13. ADD FOLLOW-UP NOTE / UPDATE FOLLOW-UP DATE FOR ENQUIRY
router.post('/enquiry-note', authenticateToken, (req, res) => {
  try {
    const { id, noteText, followUpDate, status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Enquiry ID is required.' });
    }

    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return res.status(404).json({ success: false, message: 'No submissions found.' });
    }

    const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
    const item = submissions.enquiries.find(e => e.id === id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    item.notes = item.notes || [];
    item.history = item.history || [];

    const now = new Date().toISOString();
    const adminUser = req.user?.username || 'Admin';

    if (noteText && noteText.trim()) {
      const newNote = {
        text: noteText.trim(),
        author: adminUser,
        date: now
      };
      item.notes.push(newNote);
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

    writeDatabase(SUBMISSIONS_FILE, submissions);
    res.json({ success: true, message: 'Follow-up saved successfully.', enquiry: item });
  } catch (err) {
    console.error('Error adding enquiry note:', err);
    res.status(500).json({ success: false, message: 'Error adding enquiry note.' });
  }
});

// 14. DELETE SUBMISSION
router.delete('/submission', authenticateToken, (req, res) => {
  try {
    const { type, id } = req.body;

    if (!type || !id || (type !== 'enquiry' && type !== 'message')) {
      return res.status(400).json({ success: false, message: 'Invalid params.' });
    }

    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return res.status(404).json({ success: false, message: 'No submissions file.' });
    }

    const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));

    if (type === 'enquiry') {
      submissions.enquiries = submissions.enquiries.filter(e => e.id !== id);
    } else {
      submissions.messages = submissions.messages.filter(m => m.id !== id);
    }

    writeDatabase(SUBMISSIONS_FILE, submissions);

    res.json({ success: true, message: 'Submission deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting submission.' });
  }
});

export default router;
export { authenticateToken };
