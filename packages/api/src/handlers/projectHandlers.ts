import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
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
        projectId: t.Numeric(),
      }),
      response: {
        200: t.Object({
          project: projectWithFeaturesAndEnvironments,
        }),
        404: NotFoundResponse,
      },
      beforeHandle: [({ isSignedIn }) => isSignedIn()],
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
        ({ hasProjectPermissions }) =>
          hasProjectPermissions([ProjectPermission.EDIT_PROJECT]),
      ],
    },
  )
  .delete(
    '',
    async ({ params }) => {
      const { projectId } = params;
      const project = await projectsController.getProjectById(projectId);
      await projectsController.archiveProject(projectId);
      return `Archived project: "${project.name}"`;
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      response: {
        200: t.String(),
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasProjectPermissions }) =>
          hasProjectPermissions([ProjectPermission.DELETE_PROJECT]),
      ],
    },
  );
