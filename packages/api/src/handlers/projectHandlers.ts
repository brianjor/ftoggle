import Elysia, { t } from 'elysia';
import { ProjectsController } from '../controllers/projectsController';
import { ProjectPermission } from '../enums/permissions';
import { RecordDoesNotExistError } from '../errors/dbErrors';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();

export const projectHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async (context) => {
      const { projectId } = context.params;
      const project = await projectsController.getProject(projectId);
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
      response: t.Object({
        data: t.Object({
          project: t.Object({
            id: t.Number(),
            name: t.String(),
          }),
        }),
      }),
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
          hasProjectPermissions(projectsController, [
            ProjectPermission.EDIT_PROJECT,
          ])(),
      ],
    },
  );
