import Elysia from 'elysia';
import { auth } from '../auth/lucia';
import { ProjectsController } from '../controllers/projectsController';
import { UsersController } from '../controllers/usersController';
import { ProjectPermission, UserPermission } from '../enums/permissions';
import { AuthorizationError } from '../errors/apiErrors';

const usersController = new UsersController();

export const hasPermissions = new Elysia({
  name: 'hooks:hasPermissions',
}).derive((context) => {
  return {
    hasPermissions: async (requiredPermissions: UserPermission[]) => {
      const authRequest = auth.handleRequest(context);
      const session = (await authRequest.validateBearerToken())!;

      const permissions = await usersController.getUserPermissions(
        session.user,
      );
      const missingPermission = requiredPermissions.find(
        (rp) => !permissions.includes(rp),
      );
      if (missingPermission) {
        throw new AuthorizationError(
          `Missing required permission: ${missingPermission}`,
        );
      }
    },
    /**
     * Checks if the user has the required permissions for the action they want to take
     * against the project.
     * @param projectsController Project controller to access project DB functions
     * @param requiredPermissions Project level permissions that are required to access the endpoint
     * @throws A {@link RouteError} If ":projectId" is missing from the path parameters
     * @throws An {@link AuthorizationError} If the user does not have the required permissions
     */
    hasProjectPermissions: async (
      projectsController: ProjectsController,
      requiredPermissions: ProjectPermission[],
    ) => {
      const authRequest = auth.handleRequest(context);
      const session = (await authRequest.validateBearerToken())!;

      if (!('projectId' in context.params)) {
        throw new Error(
          "hasProjectPermissions must be in a route that has a 'projectId' path parameter",
        );
      }
      const projectId = (context.params as { projectId: number }).projectId;
      const permissions = await projectsController.getUsersPermissions(
        projectId,
        session.user.userId,
      );
      const missingPermission = requiredPermissions.find(
        (rp) => !permissions.includes(rp),
      );
      if (missingPermission) {
        throw new AuthorizationError(
          `Missing required project permission: ${missingPermission}`,
        );
      }
    },
  };
});
