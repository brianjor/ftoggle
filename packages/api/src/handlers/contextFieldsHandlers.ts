import {
  contextFieldDescriptionReqs,
  contextFieldNameReqs,
} from '@ftoggle/common/validations/contextFieldsValidations';
import { Elysia, t } from 'elysia';
import { ContextFieldController } from '../controllers/contextFieldController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const contextFieldController = new ContextFieldController();
const projectsController = new ProjectsController();

export const contextFieldsHandlers = new Elysia().use(hooks).post(
  '',
  async ({ body, params }) => {
    const { projectId } = params;
    const { description, name } = body;

    await projectsController.getProjectById(projectId);

    const newContextField = await contextFieldController.createContextField(
      projectId,
      name,
      description,
    );

    return newContextField;
  },
  {
    params: t.Object({
      projectId: t.String(),
    }),
    body: t.Object({
      name: t.String({
        maxLength: contextFieldNameReqs.maxLength,
        minLength: contextFieldNameReqs.minLength,
        pattern: contextFieldNameReqs.pattern,
        // https://github.com/elysiajs/elysia/issues/514
        default: undefined,
      }),
      description: t.Optional(
        t.String({
          maxLength: contextFieldDescriptionReqs.maxLength,
          minLength: contextFieldDescriptionReqs.minLength,
        }),
      ),
    }),
    beforeHandle: [
      ({ isSignedIn }) => isSignedIn(),
      ({ hasUserPermissions }) =>
        hasUserPermissions([UserPermission.CREATE_PROJECT_CONTEXT_FIELD]),
    ],
    transform({ body }) {
      const { name, description } = body;
      body.description = contextFieldDescriptionReqs.transforms(description);
      body.name = contextFieldNameReqs.transforms(name);
    },
  },
);
