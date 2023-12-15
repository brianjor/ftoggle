import { Context, t } from 'elysia';
import { auth } from '../auth/lucia';

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

export type AuthLogoutContext = Context<{
  response: string;
}>;

export const AuthLogoutSchema = {
  response: {
    200: t.String(),
    401: t.String(),
  },
};

export class AuthHandler {
  public handleSignup = async ({ body }: AuthSignupContext) => {
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
  };

  public handleLogin = async (context: AuthLoginContext) => {
    const { set, body } = context;
    const { username, password } = body;
    const key = await auth.useKey('username', username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    set.headers['sessionId'] = `${session.sessionId}`;
    return 'Logged in as user: ' + username;
  };

  public handleLogout = async (context: AuthLogoutContext) => {
    const authRequest = auth.handleRequest(context);
    const session = (await authRequest.validateBearerToken())!;

    await auth.invalidateSession(session.sessionId);

    return `Logged out user: ${session?.user.username}`;
  };
}
