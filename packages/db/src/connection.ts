import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export const getDBConnectionString = () => {
  const requiredEnv = [
    'DB_HOST',
    'DB_NAME',
    'DB_PASSWORD',
    'DB_PORT',
    'DB_USER',
  ];
  requiredEnv.forEach((variable) => {
    if (Bun.env[variable] === undefined) {
      throw new Error(`"${variable}" not set in environment variables.`);
    }
  });

  const dbUser = Bun.env.DB_USER;
  const dbPassword = Bun.env.DB_PASSWORD;
  const dbHost = Bun.env.DB_HOST;
  const dbPort = Bun.env.DB_PORT;
  const dbName = Bun.env.DB_NAME;
  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
};

export const postgresConnection = postgres(getDBConnectionString());
export const dbClient = drizzle(postgresConnection, { schema });
