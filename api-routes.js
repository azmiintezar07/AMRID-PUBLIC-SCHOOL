import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper to find files in project directories (handles both dev source and prod dist folder)
const resolveFilePath = (filename) => {
  // If public/ exists (dev mode), write there
  const devPath = path.resolve(__dirname, filename);
  if (fs.existsSync(path.dirname(devPath))) {
    return devPath;
  }
  // Fallback to current dir or dist relative path
  return path.resolve(__dirname, filename.replace(/^public\//, 'dist/'));
};

const CONTENT_FILE = resolveFilePath('public/data/content.json');
const SUBMISSIONS_FILE = resolveFilePath('public/data/submissions.json');
const CONFIG_FILE = path.resolve(__dirname, 'admin-config.json');

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

// Read config
const getConfig = () => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading admin config:', err);
  }
  // Default values if file doesn't exist
  return {
    username: 'Azmi',
    passwordHash: '$2b$10$Ax/mDEHyNZebu238qTI49.IDydv.MdIParIe05MoeJL6Qchsv/sCW', // azmi@12345
    jwtSecret: 'amrid_public_school_super_secret_session_key_2026'
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
    // Ensure upload dir exists
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
  const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.webm'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// 1. ADMIN LOGIN
router.post('/login', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();

  console.log(`[AUTH] Login attempt received. Username: "${username}"`);

  if (!username || !password) {
    console.log('[AUTH] Rejecting: Missing username or password.');
    return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
  }

  if (username.toLowerCase() !== config.username.toLowerCase()) {
    console.log(`[AUTH] Rejecting: Username mismatch. Got "${username}", expected "${config.username}"`);
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  const passValid = bcrypt.compareSync(password, config.passwordHash);
  console.log(`[AUTH] Password comparison result: ${passValid}`);

  if (!passValid) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username: config.username }, config.jwtSecret, { expiresIn: '1d' });

  // Set HTTP-only Cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.json({ success: true, token, username });
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
    
    // Save dynamically to public and/or dist
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
    // Basic path traversal protection
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
router.post('/enquiry', (req, res) => {
  try {
    const { parentName, studentName, phoneNumber, classApply, message } = req.body;

    if (!parentName || !studentName || !phoneNumber || !classApply) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    // Strictly validate 10 digit phone
    if (!/^[0-9]{10}$/.test(phoneNumber.trim())) {
      return res.status(400).json({ success: false, message: 'Invalid 10-digit phone number.' });
    }

    // Read submissions
    let submissions = { enquiries: [], messages: [] };
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
    }

    const newEnquiry = {
      id: 'enq-' + Date.now(),
      parent_name: parentName.trim(),
      student_name: studentName.trim(),
      phone: phoneNumber.trim(),
      class_apply: classApply,
      message: (message || '').trim(),
      status: 'new', // new | contacted | follow-up | completed
      date: new Date().toISOString()
    };

    submissions.enquiries.unshift(newEnquiry); // newest first

    writeDatabase(SUBMISSIONS_FILE, submissions);

    res.json({ success: true, message: 'Enquiry submitted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error processing enquiry.' });
  }
});

// 11. PUBLIC SUBMISSION: CONTACT MESSAGE
router.post('/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    let submissions = { enquiries: [], messages: [] };
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
    }

    const newMsg = {
      id: 'msg-' + Date.now(),
      name: name.trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      is_read: false,
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
    const { type, id, status, is_read } = req.body;

    if (!type || !id || (type !== 'enquiry' && type !== 'message')) {
      return res.status(400).json({ success: false, message: 'Invalid params.' });
    }

    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return res.status(444).json({ success: false, message: 'No submissions found.' });
    }

    const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));

    if (type === 'enquiry') {
      const item = submissions.enquiries.find(e => e.id === id);
      if (item && status) {
        item.status = status;
      }
    } else {
      const item = submissions.messages.find(m => m.id === id);
      if (item) {
        item.is_read = is_read !== undefined ? is_read : true;
      }
    }

    writeDatabase(SUBMISSIONS_FILE, submissions);

    res.json({ success: true, message: 'Submission updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating submission.' });
  }
});

// 13. DELETE SUBMISSION
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
