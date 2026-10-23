import { Router } from 'express';

import {
  createProblem,
  deleteProblem,
  getProblemBySlug,
  getProblems,
  updateProblem,
} from './problem.controller.js';

import { requireAuth, allowRoles } from '../auth/auth.middleware.js';

export const problemRouter = Router();

// Public routes
problemRouter.get('/', getProblems);
problemRouter.get('/:slug', getProblemBySlug);

// Admin-only routes
problemRouter.post(
  '/',
  requireAuth,
  allowRoles('ADMIN'),
  createProblem
);

problemRouter.patch(
  '/:id',
  requireAuth,
  allowRoles('ADMIN'),
  updateProblem
);

problemRouter.delete(
  '/:id',
  requireAuth,
  allowRoles('ADMIN'),
  deleteProblem
);