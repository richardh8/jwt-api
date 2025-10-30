import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  username: string;
  role: 'admin' | 'user';
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.verify(token, secret) as JwtPayload;
};

export const getTokenFromRequest = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};
