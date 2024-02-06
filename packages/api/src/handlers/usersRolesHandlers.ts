import Elysia, { t } from 'elysia';
import { UsersController } from '../controllers/usersController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';
import { userWithRoles } from '../typeboxes/usersTypes';

const usersController = new UsersController();

export const usersRolesHandlers = new Elysia().use(hooks).get(
  '',
  async () => {
    const usersWithRoles = await usersController.getUsersAndRoles();

    return {
      users: usersWithRoles,
    };
  },
  {
    response: {
      200: t.Object({
        users: t.Array(userWithRoles),
      }),
    },
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions }) =>
        hasUserPermissions([UserPermission.VIEW_USERS]),
    ],
  },
);
