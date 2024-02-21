import Elysia, { t } from 'elysia';
import { lucia } from '../auth/lucia';
import { UsersController } from '../controllers/usersController';
import { UserPermission } from '../enums/permissions';
import { ErrorResponseBox } from '../helpers/responses';
import { hooks } from '../hooks';

const usersController = new UsersController();

export const loginHandler = new Elysia().post(
  '',
  async (context) => {
    const { body, cookie } = context;
    const { username, password } = body;
    const user = await usersController.validateUsernamePasswordLogin(
      username,
      password,
    );
    await lucia.invalidateUserSessions(user.id);
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookie['accessToken'].set({
      value: sessionCookie.value,
      path: '/',
      ...sessionCookie.attributes,
    });
    cookie['signedIn'].set({
      value: 'yes',
      path: '/',
      maxAge: sessionCookie.attributes.maxAge,
      sameSite: sessionCookie.attributes.sameSite,
      httpOnly: false,
    });
    return {
      id: user.id,
      username: user.username,
    };
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
    response: {
      200: t.Object({
        id: t.String(),
        username: t.String(),
      }),
      400: ErrorResponseBox.BadRequest,
      401: ErrorResponseBox.Unauthorized,
    },
  },
);

export const signupHandler = new Elysia().use(hooks).post(
  '',
  async ({ body }) => {
    const { username, password } = body;
    const user = await usersController.createUsernameAndPasswordUser(
      username,
      password,
    );
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
      ({ hasUserPermissions: hasPermissions }) =>
        hasPermissions([UserPermission.CREATE_USER]),
    ],
  },
);

export const logoutHandler = new Elysia().use(hooks).post(
  '',
  async ({ cookie, getRequestUser }) => {
    const { user } = await getRequestUser();
    await lucia.invalidateUserSessions(user.id);

    cookie['accessToken'].set({
      ...lucia.createBlankSessionCookie(),
      path: '/',
    });
    cookie['signedIn'].set({
      ...lucia.createBlankSessionCookie(),
      path: '/',
    });
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
    const { user } = await context.getRequestUser();
    await usersController.updatePassword(user, oldPassword, newPassword);
    await lucia.invalidateUserSessions(user.id);
  },
  {
    body: t.Object({
      oldPassword: t.String(),
      newPassword: t.String(),
    }),
    beforeHandle: [({ isSignedIn }) => isSignedIn()],
  },
);
