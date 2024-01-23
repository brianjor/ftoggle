import { postgresConnection } from '@ftoggle/db/connection';
import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql';
import { lucia } from 'lucia';
import { elysia } from 'lucia/middleware';

export const auth = lucia({
  env: Bun.env.ENVIRONMENT === 'prod' ? 'PROD' : 'DEV',
  middleware: elysia(),
  adapter: postgresAdapter(postgresConnection, {
    user: 'users',
    key: 'users_keys',
    session: 'users_sessions',
  }),
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
