import { defineConfig } from 'vite';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    port: 5173,
    host: true
  },
  build: {
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
      configureServer(server) {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
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

        // Mount uploads folder for static access in development (if needed, although Vite handles public/ uploads automatically)
        app.use('/uploads', express.static(path.resolve(__dirname, 'public/uploads')));
        
        server.middlewares.use(app);
      }
    }
  ]
});
