import { postgresConnection } from '@ftoggle/db/connection';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { Lucia } from 'lucia';

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: object;
    DatabaseUserAttributes: {
      username: string;
    };
  }
}

const adapter = new PostgresJsAdapter(postgresConnection, {
  user: 'users',
  session: 'users_sessions',
});

export const lucia = new Lucia(adapter, {
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof lucia;
