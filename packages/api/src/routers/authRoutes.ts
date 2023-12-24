import Elysia, { t } from 'elysia';
import { auth } from '../auth/lucia';
import { EPermissions } from '../enums/permissions';
import { AuthenticationError } from '../errors/apiErrors';
import { isSignedIn } from '../hooks/isSignedInHook';
import { requiresPermissions } from '../hooks/requiresPermissionHook';

const loginRoute = new Elysia().onBeforeHandle([]).post(
  '/login',
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

const signupRoute = new Elysia()
  .onBeforeHandle([isSignedIn, requiresPermissions([EPermissions.CREATE_USER])])
  .post(
    '/signup',
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
    },
  );

const logoutRoute = new Elysia().onBeforeHandle([isSignedIn]).post(
  '/logout',
  async (context) => {
    const authRequest = auth.handleRequest(context);
    const session = (await authRequest.validateBearerToken())!;

    await auth.invalidateAllUserSessions(session.user.userId);

    return `Logged out user: ${session?.user.username}`;
  },
  {
    response: {
      200: t.String(),
      401: t.String(),
    },
  },
);

const changePasswordRoute = new Elysia().onBeforeHandle([isSignedIn]).post(
  '/change-password',
  async (context) => {
    const authRequest = auth.handleRequest(context);
    const session = (await authRequest.validateBearerToken())!;
    const { oldPassword, newPassword } = context.body;
    const user = session.user;
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
  },
);

export const authRouters = new Elysia({ prefix: '/auth' })
  .use(loginRoute)
  .use(signupRoute)
  .use(logoutRoute)
  .use(changePasswordRoute);
