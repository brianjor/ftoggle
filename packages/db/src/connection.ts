import 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export const getDBConnectionString = () => {
  const requiredEnv = [
    'DB_HOST',
    'POSTGRES_DB',
    'DB_PASSWORD',
    'DB_PORT',
    'DB_USER',
  ];
  requiredEnv.forEach((variable) => {
    if (process.env[variable] === undefined) {
      throw new Error(`"${variable}" not set in environment variables.`);
    }
  });

  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;
  const dbName = process.env.POSTGRES_DB;
  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
};

export const postgresConnection = postgres(getDBConnectionString());
export const dbClient = drizzle(postgresConnection, { schema });
