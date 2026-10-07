import { defineConfig } from 'vite';
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api-routes.js';
import { initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      }
    }
  },
  plugins: [
    {
      name: 'api-server-middleware',
      async configureServer(server) {
        // Initialize database for dev server
        try {
          await initDatabase();
        } catch (err) {
          console.warn('[VITE DEV] Database init warning:', err.message);
        }

        const app = express();
        app.use(cors({ origin: true, credentials: true }));
        app.use(express.json({ limit: '10mb' }));
        app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        app.use(cookieParser());

        // Rewrite /admin to /admin.html to avoid serving admin.js in development
        app.use((req, res, next) => {
          if (req.path === '/admin' || req.path === '/admin/') {
            req.url = '/admin.html';
          }
          next();
        });

        // Mount API router under /api
        app.use('/api', apiRouter);

        // Mount uploads folder for static access in development
        const uploadDir = path.resolve(__dirname, 'public/uploads');
        app.use('/uploads', express.static(uploadDir));

        server.middlewares.use(app);
      }
    }
  ]
});
