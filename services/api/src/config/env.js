import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];

for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
}

export const env = {
  port: Number(process.env.API_PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: (process.env.CLIENT_URLS || 'http://localhost:5173,http://localhost:5174').split(',')
};
