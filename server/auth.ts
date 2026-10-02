import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from './supabaseAdmin.js';

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
    const { data, error } = await supabaseAdmin.auth.getUser(header.slice(7));
    if (error || !data.user) return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role,email')
      .eq('id', data.user.id)
      .maybeSingle();
    if (profileError) throw profileError;
    req.user = {
      uid: data.user.id,
      email: data.user.email || profile?.email || '',
      admin: profile?.role === 'admin',
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.admin) return res.status(403).json({ error: 'Administrator access required.' });
  return next();
}
