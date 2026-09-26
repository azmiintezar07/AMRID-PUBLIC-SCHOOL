import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './api-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount the API router
app.use('/api', apiRouter);

// Serve uploads folder statically
const uploadDir = path.resolve(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Serve the production build (dist)
app.use(express.static(path.resolve(__dirname, 'dist')));

// Fallback to serve dev folders statically if dist hasn't been built or is out of date
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(__dirname));

// Serve admin dashboard at /admin or /admin.html (with trailing path support)
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  const adminHtmlPath = path.resolve(__dirname, 'dist/admin.html');
  if (fs.existsSync(adminHtmlPath)) {
    res.sendFile(adminHtmlPath);
  } else {
    // If not built yet, fallback to dev admin.html
    res.sendFile(path.resolve(__dirname, 'admin.html'));
  }
});

// Fallback all other routes to index.html
app.get(/.*/, (req, res) => {
  const indexHtmlPath = path.resolve(__dirname, 'dist/index.html');
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` AMRID PUBLIC SCHOOL - Server Running Running!   `);
  console.log(` Mode: Production                                 `);
  console.log(` Port: ${PORT}                                     `);
  console.log(` Public URL: http://localhost:${PORT}             `);
  console.log(` Admin Panel: http://localhost:${PORT}/admin      `);
  console.log(`==================================================`);
});
