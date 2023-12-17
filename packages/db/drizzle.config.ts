import { defineConfig } from 'drizzle-kit';
import { getDBConnectionString } from './src/connection';

export default defineConfig({
  schema: './src/schema/**/*.ts',
  out: './src/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: getDBConnectionString(),
  },
});
