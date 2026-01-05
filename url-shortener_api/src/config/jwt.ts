import jwt from 'jsonwebtoken';
import { envConfig } from './env';

export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

const secret = envConfig.jwt.secret as string;

// Generate access token
export const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, secret, {
    expiresIn: envConfig.jwt.accessTokenExpire as any,
  });
};

// Generate refresh token
export const generateRefreshToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, secret, {
    expiresIn: envConfig.jwt.refreshTokenExpire as any,
  });
};

// Verify token
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

// Decode token without verification
export const decodeToken = (token: string): JwtPayload | null => {
  return jwt.decode(token) as JwtPayload | null;
};
