import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Add unique request ID for logging and tracing
const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

export default requestIdMiddleware;
