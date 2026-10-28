import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/api.ts';
import { initMysqlIfAvailable } from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Global safety guards to prevent unhandled crashes
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
  const app = express();

  // Parse command-line args (e.g. tsx server.ts --port 3000 --host 0.0.0.0)
  const portArgIdx = process.argv.indexOf('--port');
  const portFromArg = portArgIdx !== -1 && process.argv[portArgIdx + 1] ? Number(process.argv[portArgIdx + 1]) : null;
  const PORT = portFromArg || Number(process.env.PORT) || 3000;

  const hostArgIdx = process.argv.indexOf('--host');
  const hostFromArg = hostArgIdx !== -1 && process.argv[hostArgIdx + 1] ? process.argv[hostArgIdx + 1] : null;
  const HOST = hostFromArg || process.env.HOST || '0.0.0.0';

  // Basic security & parsing middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      service: 'SaaSLink Technologies Platform', 
      timestamp: new Date().toISOString() 
    });
  });

  // Mount core API router
  app.use('/api', apiRouter);

  // Initialize MySQL background attempt safely
  initMysqlIfAvailable().catch(err => {
    console.warn('[Database] MySQL background check note:', err?.message || err);
  });

  // Vite middleware for development vs static build in production
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexPath = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === 'production' && fs.existsSync(distIndexPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(distIndexPath);
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.error('[Server] Failed to create Vite dev server:', viteErr);
      if (fs.existsSync(distIndexPath)) {
        console.log('[Server] Falling back to pre-built dist assets');
        app.use(express.static(distPath));
        app.get('*', (req, res, next) => {
          if (req.path.startsWith('/api')) return next();
          res.sendFile(distIndexPath);
        });
      }
    }
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[SaaSLink Server] Running on http://${HOST}:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[SaaSLink Server] Port ${PORT} busy. Retrying in 1s...`);
      setTimeout(() => {
        try {
          server.close();
          server.listen(PORT, HOST);
        } catch (retryErr) {
          console.error('[SaaSLink Server] Retry error:', retryErr);
        }
      }, 1000);
    } else {
      console.error('[SaaSLink Server] Server error:', err);
    }
  });

  // Handle graceful termination
  const shutdown = () => {
    server.close(() => {
      console.log('[SaaSLink Server] Closed connections cleanly');
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch(err => {
  console.error('[Fatal] Server failed to start:', err);
});

