import { Elysia, t } from 'elysia';
import { ContextFieldController } from '../controllers/contextFieldController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const contextFieldController = new ContextFieldController();
const projectsController = new ProjectsController();

export const contextFieldHandlers = new Elysia().use(hooks).delete(
  '',
  async ({ params }) => {
    const { projectId, contextFieldName } = params;
    await projectsController.getProjectById(projectId);
    await contextFieldController.deleteContextFieldByName(
      projectId,
      contextFieldName,
    );

    return new Response(null, { status: 204 });
  },
  {
    params: t.Object({
      projectId: t.String(),
      contextFieldName: t.String(),
    }),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions }) =>
        hasUserPermissions([UserPermission.DELETE_PROJECT_CONTEXT_FIELD]),
    ],
  },
);
