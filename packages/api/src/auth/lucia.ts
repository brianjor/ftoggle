import { postgresConnection } from '@ftoggle/db/connection';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { GitHub } from 'arctic';
import { Lucia } from 'lucia';

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: object;
    DatabaseUserAttributes: {
      username: string;
      githubId: number;
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
      githubId: data.githubId,
    };
  },
});

export type Auth = typeof lucia;

export const github = new GitHub(
  Bun.env.GITHUB_CLIENT_ID ?? '',
  Bun.env.GITHUB_CLIENT_SECRET ?? '',
);
