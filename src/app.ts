import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import animalRoutes from './routes/animal.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { securityMiddleware, rateLimitConfig, corsConfig } from './middleware/security.middleware.js';

// Configure environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 6677;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// Apply security middleware
app.use(securityMiddleware);

// Rate limiting
const limiter = rateLimit(rateLimitConfig);
app.use(limiter);

// CORS configuration
app.use(cors(corsConfig));

// Body parsing middleware with size limit
app.use(express.json({ limit: process.env.BODY_PARSER_LIMIT || '10kb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.BODY_PARSER_LIMIT || '10kb' }));

// API Routes
app.use('/api/animals', animalRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    path: req.path
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Only start servers if not in test environment
if (process.env.NODE_ENV !== 'test') {
  // Create SSL directory if it doesn't exist
  const sslDir = path.join(process.cwd(), 'ssl');
  if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
  }

  // SSL options
  const sslOptions: https.ServerOptions = {
    key: fs.readFileSync(path.join(sslDir, 'private.key')),
    cert: fs.readFileSync(path.join(sslDir, 'certificate.crt')),
    minVersion: 'TLSv1.2' as const,
    ciphers: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      '!RC4', '!DES', '!MD5', '!PSK', '!SRP', '!CAMELLIA'
    ].join(':'),
    honorCipherOrder: true
  };

  // Create HTTPS server
  const httpsServer = https.createServer(sslOptions, app);
  
  if (isProduction) {
    // In production, set up HTTP to HTTPS redirect
    const httpApp = express();
    httpApp.use((req, res) => {
      const host = req.headers.host?.replace(/:[0-9]+$/, '');
      res.redirect(301, `https://${host}:${PORT}${req.url}`);
    });
    
    const httpServer = http.createServer(httpApp);
    httpServer.listen(80, () => {
      console.log('HTTP server redirecting to HTTPS on port 80');
    });
    
    httpsServer.listen(PORT, () => {
      console.log(`Production HTTPS server running on port ${PORT}`);
    });
  } else {
    // In development, only use HTTPS
    httpsServer.listen(PORT, () => {
      console.log(`Development server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`HTTPS server running on https://localhost:${PORT}`);
    });
  }

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    // Perform cleanup if needed
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

export default app;
