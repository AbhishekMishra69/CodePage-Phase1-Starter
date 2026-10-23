import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User } from './user.model.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
    if (!token) return res.status(401).json({ message: 'Authentication token is required.' });
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'You do not have permission for this action.' });
}
