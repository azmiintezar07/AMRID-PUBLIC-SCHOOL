/**
 * server.js - Production HTTP & API Server for AMRID PUBLIC SCHOOL
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './api-routes.js';
import { initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Configure CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(u => u.trim().replace(/\/$/, '')).filter(Boolean)
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, same-origin)
    if (!origin) return callback(null, true);

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    // In non-production, allow all localhost ports
    if (!isProd && isLocalhost) {
      return callback(null, true);
    }

    // In production, allow configured FRONTEND_URL or same host
    if (allowedOrigins.length > 0) {
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
    } else if (!isProd) {
      return callback(null, true);
    }

    // Reject unknown origins in production
    callback(new Error(`CORS blocked: Origin '${origin}' is not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Ensure upload directories exist
const uploadDirDev = path.resolve(__dirname, 'public/uploads');
const uploadDirProd = path.resolve(__dirname, 'dist/uploads');
if (!fs.existsSync(uploadDirDev)) fs.mkdirSync(uploadDirDev, { recursive: true });
if (!fs.existsSync(uploadDirProd)) fs.mkdirSync(uploadDirProd, { recursive: true });

// Serve static uploads
app.use('/uploads', express.static(uploadDirDev));

// Mount API router
app.use('/api', apiRouter);

// Serve production build if present
const distDir = path.resolve(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Fallback to serve static public and root directory
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(__dirname));

// Serve Admin Dashboard
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  const prodAdmin = path.resolve(__dirname, 'dist/admin.html');
  if (fs.existsSync(prodAdmin)) {
    return res.sendFile(prodAdmin);
  }
  res.sendFile(path.resolve(__dirname, 'admin.html'));
});

// Fallback all remaining routes to index.html (SPA support)
app.get(/.*/, (req, res) => {
  const prodIndex = path.resolve(__dirname, 'dist/index.html');
  if (fs.existsSync(prodIndex)) {
    return res.sendFile(prodIndex);
  }
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Production error-handling middleware (never leaks stack traces or credentials)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: isProd ? 'Internal server error. Please try again later.' : (err.message || 'Server error')
  });
});

// Initialize database & start server
async function startServer() {
  try {
    await initDatabase();
  } catch (dbErr) {
    console.error('[DATABASE] Initialization warning:', dbErr.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` AMRID PUBLIC SCHOOL - Server Running Running!   `);
    console.log(` Mode: ${isProd ? 'Production' : 'Development'}    `);
    console.log(` Port: ${PORT}                                     `);
    console.log(` Public URL: http://localhost:${PORT}             `);
    console.log(` Admin Panel: http://localhost:${PORT}/admin      `);
    console.log(`==================================================`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n[SERVER] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[SERVER] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();

export default app;
