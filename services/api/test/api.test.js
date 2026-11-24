import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/ci-test';
process.env.JWT_SECRET = 'ci-test-secret';

const { app } = await import('../src/app.js');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

test('GET /health returns status ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('unknown route returns 404', async () => {
  const res = await fetch(`${baseUrl}/does-not-exist`);
  assert.equal(res.status, 404);
});

test('GET /api/v1/auth/me without a token is rejected', { timeout: 5000 }, async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/me`);
  assert.ok([401, 403].includes(res.status), `unexpected status ${res.status}`);
});