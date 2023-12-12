import 'dotenv';
import { lucia } from 'lucia';
import { elysia } from 'lucia/middleware';
import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql';
import { postgresConnection } from '../db/connection';

export const auth = lucia({
  env: process.env.ENVIRONMENT === 'prod' ? 'PROD' : 'DEV',
  middleware: elysia(),
  adapter: postgresAdapter(postgresConnection, {
    user: 'users',
    key: 'user_keys',
    session: 'user_sessions',
  }),
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
