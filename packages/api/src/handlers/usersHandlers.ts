import Elysia, { t } from 'elysia';
import { UsersController } from '../controllers/usersController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const usersController = new UsersController();

export const usersHandlers = new Elysia().use(hooks).get(
  '',
  async () => {
    return {
      data: {
        users: await usersController.getUsers(),
      },
    };
  },
  {
    response: {
      200: t.Object({
        data: t.Object({
          users: t.Array(
            t.Object({
              id: t.String(),
              username: t.String(),
            }),
          ),
        }),
      }),
    },
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions: hasPermissions }) =>
        hasPermissions([UserPermission.VIEW_USERS]),
    ],
  },
);
