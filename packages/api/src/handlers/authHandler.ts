import { Context, t } from 'elysia';
import { auth } from '../auth/lucia';
import postgres from 'postgres';

export type AuthSignupContext = Context<{
  body: {
    username: string;
    password: string;
  };
  response: string;
}>;

export const AuthSignupSchema = {
  body: t.Object({
    username: t.String(),
    password: t.String(),
  }),
  response: t.String(),
};

export type AuthLoginContext = Context<{
  body: {
    username: string;
    password: string;
  };
}>;

export const AuthLoginSchema = {
  body: t.Object({
    username: t.String(),
    password: t.String(),
  }),
};

export class AuthHandler {
  public handleSignup = async (context: AuthSignupContext) => {
    const { set, body } = context;
    try {
      const user = await auth.createUser({
        key: {
          providerId: 'username',
          providerUserId: body.username.toLowerCase(),
          password: body.password,
        },
        attributes: {
          username: body.username,
        },
      });
      return `Created user: ${user.username}`;
    } catch (err) {
      console.error(err);
      if (
        err instanceof postgres.PostgresError &&
        err.message ===
          'duplicate key value violates unique constraint "users_username_unique"'
      ) {
        set.status = 400;
        return 'Username already taken';
      }
      set.status = 500;
      return 'Internal server error';
    }
  };

  public handleLogin = async (context: AuthLoginContext) => {
    const { set, body } = context;
    try {
      const { username, password } = body;
      const key = await auth.useKey(
        'username',
        username.toLowerCase(),
        password,
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      const authRequest = auth.handleRequest(context);
      authRequest.setSession(session);
      return 'Logged in as user: ' + username;
    } catch (e) {
      console.log(e);
      set.status = 500;
      return 'Internal server error';
    }
  };
}
