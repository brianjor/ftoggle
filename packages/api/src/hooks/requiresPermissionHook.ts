import Elysia from 'elysia';
import { auth } from '../auth/lucia';
import { getUserPermissions } from '../controllers/usersController';
import { EPermissions } from '../enums/permissions';
import { AuthorizationError } from '../errors/apiErrors';

export const hasPermissions = new Elysia({
  name: 'hooks:hasPermissions',
}).derive((context) => {
  return {
    hasPermissions: (requiredPermissions: EPermissions[]) => {
      return async () => {
        const authRequest = auth.handleRequest(context);
        const session = (await authRequest.validateBearerToken())!;

        const permissions = await getUserPermissions(session.user);
        const missingPermission = requiredPermissions.find(
          (rp) => !permissions.includes(rp),
        );
        if (missingPermission) {
          throw new AuthorizationError(
            `Missing required permission: ${missingPermission}`,
          );
        }
      };
    },
  };
});
