import { Context } from 'elysia';
import { auth } from '../auth/lucia';
import { getUserPermissions } from '../controllers/usersController';
import { EPermissions } from '../enums/permissions';
import { AuthorizationError } from '../errors/apiErrors';

export const requiresPermission = (permission: EPermissions) => {
  return async (context: Context) => {
    const authRequest = auth.handleRequest(context);
    const session = (await authRequest.validateBearerToken())!;

    const permissions = await getUserPermissions(session.user);
    if (!permissions.includes(permission)) {
      throw new AuthorizationError(
        `Missing required permission: ${permission}`,
      );
    }
  };
};
