import { UserRole } from '@ftoggle/common/enums/roles';
import Elysia from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { UsersController } from '../controllers/usersController';
import { ProjectPermission, UserPermission } from '../enums/permissions';
import { AuthorizationError, InternalServerError } from '../errors/apiErrors';
import { requestUserHooks } from './requestUserHooks';

const usersController = new UsersController();
const projectsController = new ProjectsController();

export const hasPermissions = new Elysia({
  name: 'hooks:hasPermissions',
})
  .use(requestUserHooks)
  .derive((context) => {
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
      /**
       * Checks if the user has the required permissions for the action they want to take
       * against the project.
       * @param requiredPermissions Project level permissions that are required to access the endpoint
       * @throws An {@link InternalServerError} If ":projectId" is missing from the path parameters
       * @throws An {@link AuthorizationError} If the user does not have the required permissions
       */
      hasProjectPermissions: async (
        requiredPermissions: ProjectPermission[],
      ) => {
        if (!('projectId' in context.params)) {
          throw new InternalServerError(
            "hasProjectPermissions must be in a route that has a 'projectId' path parameter",
          );
        }
        const { user } = await context.getRequestUser();

        // Admin users bypass any project level permission check
        const userRoles = await usersController.getUsersRoles(user.id);
        if (userRoles.some((ur) => ur.name === UserRole.ADMIN)) return;

        // Check if user has permission for the project
        const projectId = (context.params as { projectId: string }).projectId;
        await projectsController.getProjectById(projectId);
        const permissions = await projectsController.getUsersPermissions(
          projectId,
          user.id,
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
