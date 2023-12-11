import { defineConfig } from 'drizzle-kit';
import { getDBConnectionString } from './src/db/connection';

export default defineConfig({
  schema: './src/db/schema/**/*.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: getDBConnectionString(),
  },
});
