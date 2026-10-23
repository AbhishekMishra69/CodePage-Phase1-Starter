
import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware.js';

import {
  getQuestions,
  submitTest,
  verifyCertificate,
  getMyCertificates,
} from './certification.controller.js';

export const certificationRouter = Router();

certificationRouter.get('/:type/questions', requireAuth, getQuestions);

certificationRouter.post('/:type/submit', requireAuth, submitTest);

certificationRouter.get('/certificates/my', requireAuth, getMyCertificates);

certificationRouter.get(
  '/certificates/:certificateId/verify',
  verifyCertificate
);
