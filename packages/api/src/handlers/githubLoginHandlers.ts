import { dbClient } from '@ftoggle/db/connection';
import { tUsers } from '@ftoggle/db/schema';
import { OAuth2RequestError, generateState } from 'arctic';
import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { generateId } from 'lucia';
import { github, lucia } from '../auth/lucia';
import { HttpStatus } from '../helpers/responses';
import { UsersTableItem } from '../typeboxes/usersTypes';

interface GitHubUser {
  id: number;
  login: string;
}

export const githubLoginHandler = new Elysia()
  .get('', async ({ cookie, set }) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    cookie['github_oauth_state'].set({
      value: state,
      path: '/',
      secure: Bun.env.ENVIRONMENT !== 'dev',
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    });

    set.redirect = url.toString();
  })
  .get(
    '/callback',
    async ({ cookie, query, set }) => {
      const code = query.code;
      const state = query.state;
      const storedState = cookie.github_oauth_state.get();

      if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, { status: HttpStatus.BadRequest });
      }

      try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });
        const githubUser: GitHubUser =
          (await githubUserResponse.json()) as GitHubUser;

        const existingUser = await dbClient.query.tUsers.findFirst({
          where: eq(tUsers.githubId, githubUser.id),
        });

        let user: UsersTableItem;
        if (existingUser) {
          user = existingUser;
        } else {
          // new user
          const userId = generateId(15);

          user = (
            await dbClient
              .insert(tUsers)
              .values({
                id: userId,
                githubId: githubUser.id,
                username: githubUser.login,
              })
              .returning()
          )[0];
        }
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookie['github_oauth_state'].set({
          ...lucia.createBlankSessionCookie(),
          path: '/',
        });
        cookie['accessToken'].set({
          value: sessionCookie.value,
          path: '/',
          ...sessionCookie.attributes,
        });
        cookie['signedIn'].set({
          value: 'yes',
          path: '/',
          maxAge: sessionCookie.attributes.maxAge,
          sameSite: sessionCookie.attributes.sameSite,
          httpOnly: false,
        });
        set.redirect = `${Bun.env.UI_BASE_URL}/projects`;
        return;
      } catch (error) {
        console.error(error);
        if (error instanceof OAuth2RequestError) {
          return new Response(null, {
            status: HttpStatus.BadRequest,
          });
        }
        return new Response(null, {
          status: HttpStatus.InternalServerError,
        });
      }
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
      // cookie: t.Object({
      //   github_oauth_state: t.String(),
      // }),
    },
  );
