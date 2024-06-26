import Elysia, { t } from 'elysia';
import { UsersController } from '../controllers/usersController';
import { UserPermission } from '../enums/permissions';
import { hooks } from '../hooks';

const usersController = new UsersController();

export const userHandlers = new Elysia()
  .use(hooks)
  .get(
    '',
    async ({ params }) => {
      const { userId } = params;
      return {
        data: {
          user: await usersController.getUserById(userId),
        },
      };
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
      response: {
        200: t.Object({
          data: t.Object({
            user: t.Object({
              id: t.String(),
              username: t.String(),
            }),
          }),
        }),
        401: t.String(),
        403: t.String(),
        404: t.String(),
      },
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.VIEW_USERS]),
      ],
    },
  )
  .patch(
    '',
    async ({ body, params }) => {
      const { userId } = params;
      const { isApproved } = body;

      await usersController.patchUser(userId, { isApproved });
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
      body: t.Object({
        isApproved: t.Optional(t.Boolean()),
      }),
      beforeHandle: [
        ({ isSignedIn }) => isSignedIn(),
        ({ hasUserPermissions }) =>
          hasUserPermissions([UserPermission.CHANGE_USERS_APPROVAL]),
      ],
    },
  );
