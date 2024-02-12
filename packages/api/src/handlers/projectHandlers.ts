import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { NotFoundResponse } from '../helpers/responses';
import { hooks } from '../hooks';
import { projectWithFeaturesAndEnvironments } from '../typeboxes/projectsTypes';

const projectsController = new ProjectsController();

export const projectHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async (context) => {
      const { projectId } = context.params;
      const project = await projectsController.getProjectById(projectId);
      return { project };
    },
    {
      params: t.Object({
        projectId: t.String(),
      }),
      response: {
        200: t.Object({
          project: projectWithFeaturesAndEnvironments,
        }),
        404: NotFoundResponse,
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.VIEW_PROJECTS]),
      ],
    },
  )
  .put(
    '',
    async (context) => {
      const { body, params } = context;
      const { projectId } = params;
      const updateFields = {
        name: body.name,
      };
      await projectsController.updateProject(projectId, updateFields);
    },
    {
      body: t.Object({
        name: t.String({ optional: true }),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.EDIT_PROJECT]),
      ],
    },
  )
  .delete(
    '',
    async ({ params }) => {
      const { projectId } = params;
      await projectsController.deleteProject(projectId);
      return {
        message: 'Deleted project',
      };
    },
    {
      params: t.Object({
        projectId: t.String(),
      }),
      response: {
        200: t.Object({
          message: t.String(),
        }),
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.DELETE_PROJECT]),
      ],
    },
  );
