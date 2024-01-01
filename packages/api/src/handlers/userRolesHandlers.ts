import Elysia, { t } from 'elysia';
import { UsersController } from '../controllers/usersController';
import { UserPermission } from '../enums/permissions';
import { UserRole } from '../enums/roles';
import { hooks } from '../hooks';

const usersController = new UsersController();

export const userRolesHandlers = new Elysia().use(hooks).post(
  '',
  async ({ params, body }) => {
    const { userId } = params;
    const { role } = body;
    const user = await usersController.getUserById(userId);

    await usersController.addRoleToUser(userId, role);

    return `Added role: "${role}" to user: "${user.username}"`;
  },
  {
    params: t.Object({
      userId: t.String(),
    }),
    body: t.Object({
      role: t.Enum(UserRole, {
        error: `role: Expected one of [${Object.values(UserRole).join(', ')}]`,
      }),
    }),
    response: {
      200: t.String(),
      400: t.String(),
      401: t.String(),
      403: t.String(),
    },
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasPermissions }) => hasPermissions([UserPermission.ADD_ROLE_TO_USER]),
    ],
  },
);
