import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

connectDatabase().then(() => app.listen(env.port, () => console.log(`API listening on port ${env.port}`))).catch((error) => {
  console.error('Unable to start API:', error.message);
  process.exit(1);
});
