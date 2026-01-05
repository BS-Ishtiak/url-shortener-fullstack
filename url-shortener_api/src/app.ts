/// <reference path="./types/express.d.ts" />
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import requestIdMiddleware from './middlewares/requestId.middleware';
import securityMiddleware from './middlewares/security.middleware';
import errorHandler from './middlewares/error.middleware';
import { dbHealthCheck } from './config/database';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth.routes';
import urlRoutes from './routes/url.routes';

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

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Health check with database status
app.get('/health', async (req: Request, res: Response) => {
  try {
    const dbHealth = await dbHealthCheck();
    res.status(200).json({
      status: 'ok',
      database: dbHealth ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
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

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
// app.use('/api/users', userRoutes);
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
