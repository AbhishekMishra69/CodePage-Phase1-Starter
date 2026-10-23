# CodePage

Phase 1 foundation for an online coding practice platform. It has separate React experiences for participants and administrators, backed by one role-aware Express API.

## Structure

```text
apps/user-web       Participant-facing React application
apps/admin-web      Administrator React application
services/api        Express + MongoDB API
```

The API is deliberately organized by feature (`modules/auth`, later `modules/problems`, `modules/submissions`, `modules/contests`, and `modules/leaderboard`). The future Docker judge should be added as a separate worker/service rather than run inside HTTP requests.

## Run locally

1. Install Node.js 20+ and start MongoDB locally (or use a MongoDB Atlas connection string).
2. Copy `.env.example` values into `services/api/.env`. Set a real `JWT_SECRET`.
3. In `apps/user-web/.env.local` and `apps/admin-web/.env.local`, add:

   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. From this folder, install packages and start everything:

   ```bash
   npm install
   npm run dev
   ```

User app: http://localhost:5173. Admin app: http://localhost:5174. API health: http://localhost:5000/health.

## Authentication endpoints

- `POST /api/v1/auth/register` — creates a participant account only.
- `POST /api/v1/auth/login` — logs in a participant or administrator.
- `GET /api/v1/auth/me` — requires `Authorization: Bearer <token>`.
- `GET /api/v1/admin/overview` — requires an administrator token.

Administrator accounts are intentionally not creatable through the public registration endpoint. Create them through a future protected admin-management workflow or a controlled seed script.


## Project Status

🚧 Currently in Development — New features and improvements are in progress.
