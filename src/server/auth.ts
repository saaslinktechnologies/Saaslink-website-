import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, RoleName } from '../types.ts';
import { getDb } from './db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'saaslink-secure-token-secret-2026';

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; email: string; role: RoleName; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: RoleName; name: string };
  } catch (err) {
    return null;
  }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : (req.query.token as string);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in with valid credentials.' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  const db = getDb();
  const user = db.users.find(u => u.id === payload.id && u.isActive);
  if (!user) {
    return res.status(401).json({ error: 'User account not found or deactivated.' });
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
  next();
}

export function requireRole(allowedRoles: RoleName[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (req.user.role === 'Super Administrator') {
      return next(); // Super Admin has access to everything
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of: ${allowedRoles.join(', ')}. Current role: ${req.user.role}` 
      });
    }

    next();
  };
}
