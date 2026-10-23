import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';

import { authRouter } from './modules/auth/auth.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { problemRouter } from './modules/problems/problem.routes.js';
import { executionRouter } from './modules/execution/execution.routes.js';


import { certificationRouter } from './modules/certifications/certification.routes.js';
export const app = express();

app.use(cors({ origin: env.clientUrls, credentials: true }));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/admin', adminRouter);

app.use('/api/v1/problems', problemRouter);

app.use('/api/v1/execution', executionRouter);
app.use('/api/v1/certifications', certificationRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: 'Unexpected server error.',
  });
});