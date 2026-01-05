import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { AuthError } from '../utils/errors';

// Verify JWT token from Authorization header
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
      role: 'user',
    };

    next();
  } catch (error) {
    if (error instanceof AuthError) {
      next(error);
    } else {
      next(new AuthError('Invalid or expired token'));
    }
  }
};

export default authMiddleware;
