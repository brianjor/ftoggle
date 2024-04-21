import {
  projectIdReqs,
  projectNameReqs,
} from '@ftoggle/common/validations/projectsValidations';
import Elysia, { t } from 'elysia';
import { ContextFieldController } from '../controllers/contextFieldController';
import { FeaturesController } from '../controllers/featuresController';
import { ProjectsController } from '../controllers/projectsController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const projectsController = new ProjectsController();
const featuresController = new FeaturesController();
const contextFieldController = new ContextFieldController();

export const projectsHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async () => {
      const projects = await projectsController.getProjects();

      return {
        data: {
          projects,
        },
      };
    },
    {
      response: t.Object({
        data: t.Object({
          projects: t.Array(
            t.Object({
              id: t.String(),
              name: t.String(),
              createdAt: t.Date(),
              modifiedAt: t.Date(),
            }),
          ),
        }),
      }),
      beforeHandle: [({ isSignedIn }) => isSignedIn()],
    },
  )
  .post(
    '',
    async (context) => {
      const { body } = context;
      const { projectId, projectName } = body;
      const project = await projectsController.createProject(
        projectId,
        projectName,
      );
      await contextFieldController.createContextField(
        project.id,
        'currentTime',
        'Enables conditional restrictions on date values.',
      );
      await projectsController.addEnvironment('dev', project.id);
      await projectsController.addEnvironment('prod', project.id);
      await featuresController.addFeature('feature', project.id);
      return project;
    },
    {
      body: t.Object({
        projectId: t.String({
          maxLength: projectIdReqs.maxLength,
          minLength: projectIdReqs.minLength,
          pattern: projectIdReqs.pattern,
        }),
        projectName: t.String({
          maxLength: projectNameReqs.maxLength,
          minLength: projectNameReqs.minLength,
        }),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.CREATE_PROJECT]),
      ],
      transform({ body }) {
        const { projectName, projectId } = body;
        body.projectId = projectIdReqs.transforms(projectId);
        body.projectName = projectNameReqs.transforms(projectName);
      },
    },
  );
