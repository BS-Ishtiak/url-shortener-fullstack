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


app.use(requestIdMiddleware);

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(securityMiddleware);

// Health check endpoint
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

// API info endpoint
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

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Protected API routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);


/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL using short code
 *     description: Redirects to the original long URL associated with the short code. Public endpoint, no authentication required.
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         description: The short code for the URL (alphanumeric, typically 4+ characters)
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]{4,}$'
 *           example: 'LVDKY8'
 *     responses:
 *       301:
 *         description: Permanent redirect to the original URL
 *       404:
 *         description: Short code not found
 *       400:
 *         description: Invalid short code format
 */
app.get('/:shortCode', async (req: Request, res: Response, next) => {
  const { shortCode } = req.params;
  
  // Skip if it's a reserved route
  if (['api', 'api-docs', 'health', 'favicon.ico'].includes(shortCode)) {
    return next();
  }

  // Validate short code format
  if (!/^[a-zA-Z0-9]{4,}$/.test(shortCode)) {
    return next();
  }

  try {
    const { redirectUrlController } = await import('./controllers/url.controller');
    return redirectUrlController(req, res, next);
  } catch (error) {
    next(error);
  }
});

// 404 handler - MUST be last
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint '${req.method} ${req.path}' does not exist.`,
    requestId: req.id,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
