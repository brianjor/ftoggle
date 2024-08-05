import Elysia from 'elysia';
import { UsersController } from '../controllers/usersController';
import { UserPermission } from '../enums/permissions';
import { AuthorizationError } from '../errors/apiErrors';
import { requestUserHooks } from './requestUserHooks';

const usersController = new UsersController();

export const hasPermissions = new Elysia({
  name: 'hooks:hasPermissions',
})
  .use(requestUserHooks)
  .derive({ as: 'global' }, (context) => {
    return {
      hasUserPermissions: async (requiredPermissions: UserPermission[]) => {
        const { user } = await context.getRequestUser();

        const permissions = await usersController.getUserPermissions(user);
        const missingPermission = requiredPermissions.find(
          (rp) => !permissions.includes(rp),
        );
        if (missingPermission) {
          throw new AuthorizationError(
            `Missing required permission: ${missingPermission}`,
          );
        }
      },
    };
  });
