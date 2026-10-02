import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from './firebaseAdmin.js';

declare global {
  namespace Express {
    interface Request {
      user?: { uid: string; email: string; admin: boolean };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const decoded = await adminAuth.verifyIdToken(header.slice(7));
    req.user = { uid: decoded.uid, email: decoded.email || '', admin: decoded.admin === true };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.admin) return res.status(403).json({ error: 'Administrator access required.' });
  return next();
}
