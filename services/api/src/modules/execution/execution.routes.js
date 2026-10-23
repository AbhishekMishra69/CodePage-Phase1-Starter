import { Router } from 'express';

import {
  executeCode,
  submitCode,
} from './execution.controller.js';

import { getMySubmissions } from './submission.controller.js';

import { requireAuth } from '../auth/auth.middleware.js';

export const executionRouter = Router();

executionRouter.post('/run', executeCode);

executionRouter.post(
  '/submit',
  requireAuth,
  submitCode
);

executionRouter.get(
  '/submissions',
  requireAuth,
  getMySubmissions
);