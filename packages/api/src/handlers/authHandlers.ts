import Elysia, { t } from 'elysia';
import { auth } from '../auth/lucia';
import { EPermissions } from '../enums/permissions';
import { AuthenticationError } from '../errors/apiErrors';
import { hooks } from '../hooks';

export const loginHandler = new Elysia().post(
  '',
  async (context) => {
    const { body } = context;
    const { username, password } = body;
    const key = await auth.useKey('username', username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    return { accessToken: session.sessionId };
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
    response: t.Object({
      accessToken: t.String(),
    }),
  },
);

export const signupHandler = new Elysia().use(hooks).post(
  '',
  async ({ body }) => {
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
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
    response: t.String(),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasPermissions }) => hasPermissions([EPermissions.CREATE_USER])(),
    ],
  },
);

export const logoutHandler = new Elysia().use(hooks).post(
  '',
  async (context) => {
    const user = await context.getRequestUser();
    await auth.invalidateAllUserSessions(user.userId);

    return `Logged out user: ${user.username}`;
  },
  {
    response: {
      200: t.String(),
      401: t.String(),
    },
    beforeHandle: [({ isSignedIn }) => isSignedIn()],
  },
);

export const changePasswordHandler = new Elysia().use(hooks).post(
  '',
  async (context) => {
    const { oldPassword, newPassword } = context.body;
    const user = await context.getRequestUser();
    try {
      await auth.useKey('username', user.username.toLowerCase(), oldPassword);
    } catch (e) {
      throw new AuthenticationError('Unable to validate password');
    }
    await auth.updateKeyPassword(
      'username',
      user.username.toLowerCase(),
      newPassword,
    );
    await auth.invalidateAllUserSessions(user.userId);
  },
  {
    body: t.Object({
      oldPassword: t.String(),
      newPassword: t.String(),
    }),
    beforeHandle: [({ isSignedIn }) => isSignedIn()],
  },
);
