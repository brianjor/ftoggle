import Elysia, { t } from 'elysia';
import { UsersController } from '../controllers/usersController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const usersController = new UsersController();

export const userRoleHandlers = new Elysia().use(hooks).delete(
  '',
  async ({ set, params }) => {
    const { userId, roleId } = params;
    const { user, role } = await usersController.getUsersRolesRelation(
      userId,
      roleId,
    );

    if (user.username === 'Admin') {
      set.status = 400;
      return 'Cannot remove roles from user: "Admin"';
    }

    await usersController.removeRoleFromUser(userId, roleId);

    return `Removed role: "${role.name}" from user: "${user.username}"`;
  },
  {
    params: t.Object({
      userId: t.String(),
      roleId: t.Numeric(),
    }),
    response: {
      200: t.String(),
      400: t.String(),
      401: t.String(),
      403: t.String(),
    },
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions: hasPermissions }) =>
        hasPermissions([UserPermission.REMOVE_ROLE_FROM_USER]),
    ],
  },
);
