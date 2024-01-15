import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import { hooks } from '../hooks';
import { DataContract } from '../typeboxes/common';
import { projectWithFeaturesAndEnvironments } from '../typeboxes/projectsTypes';

const projectsController = new ProjectsController();

export const projectHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async (context) => {
      const { projectId } = context.params;
      const project = await projectsController.getProjectById(projectId);
      if (project === undefined) {
        throw new RecordDoesNotExistError(
          `Project with id: ${projectId} does not exist.`,
        );
      }
      return {
        data: {
          project,
        },
      };
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      response: DataContract(
        t.Object({
          project: projectWithFeaturesAndEnvironments,
        }),
      ),
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
