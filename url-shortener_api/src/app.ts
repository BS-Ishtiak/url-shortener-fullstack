import 'src/types/express';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import requestIdMiddleware from './middlewares/requestId.middleware';
import securityMiddleware from './middlewares/security.middleware';
import errorHandler from './middlewares/error.middleware';

const app: Application = express();

// Request ID middleware
app.use(requestIdMiddleware);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Security headers
app.use(securityMiddleware);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'URL Shortener API',
    version: '1.0.0',
    description: 'A production-grade URL shortening service',
    endpoints: {
      health: '/health',
      users: '/api/users',
      urls: '/api/urls',
      analytics: '/api/analytics',
    },
  });
});

// Route registration placeholders
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/urls', urlRoutes);
// app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint '${req.method} ${req.path}' does not exist.`,
    requestId: req.id,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
