import { Request, Response, NextFunction, RequestHandler } from 'express';
import helmet from 'helmet';
import { RateLimitRequestHandler } from 'express-rate-limit';

// Type for the security middleware array
type SecurityMiddleware = (RequestHandler | RateLimitRequestHandler)[];

// Create security middleware array with proper typing
export const securityMiddleware: SecurityMiddleware = [
  // Set security headers with helmet
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    frameguard: { action: 'deny' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'same-origin' },
  }),

  // Additional security headers and cache control
  (req: Request, res: Response, next: NextFunction): void => {
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent opening page in iframe
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Enable DNS prefetch control
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');
    
    // Disable caching for all responses
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    
    next();
  },
];

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response): void => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
    });
  },
};

// CORS configuration
export const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, origin?: string) => void): void => {
    // In development, allow all origins for easier testing
    if (process.env.NODE_ENV === 'development') {
      return callback(null, origin || '*');
    }

    // In production, only allow specified origins
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || [];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 600, // 10 minutes
};
