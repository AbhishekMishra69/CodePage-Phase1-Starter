import { Router } from 'express';
import { requireAuth, allowRoles } from '../auth/auth.middleware.js';
import { ROLES } from '../auth/user.model.js';

export const adminRouter = Router();
adminRouter.use(requireAuth, allowRoles(ROLES.ADMIN));
adminRouter.get('/overview', (_req, res) => res.json({ message: 'Admin API is ready for problem and contest management.' }));
