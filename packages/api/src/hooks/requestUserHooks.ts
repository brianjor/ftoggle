import Elysia, { Context } from 'elysia';
import { lucia } from '../auth/lucia';
import { AuthenticationError, AuthorizationError } from '../errors/apiErrors';

/**
 * Validates the token for the user of the request.
 * @param context The request context
 * @returns The user making the request
 * @throws An {@link AuthenticationError} if user cannot be validated
 */
const validateUserToken = async (context: Context) => {
  const accessToken = context.cookie['accessToken'].get();

  if (!accessToken) {
    throw new AuthenticationError('Missing cookie: "accessToken"');
  }
  const { session, user } = await lucia.validateSession(accessToken);
  if (!user || !session) {
    throw new AuthenticationError('Unable to authenticate user');
  }
  return { user, session };
};

export const requestUserHooks = new Elysia({
  name: 'hooks:getRequestUser',
}).derive((context) => ({
  /**
   * Checks if user is signed in.
   * @throws An {@link AuthenticationError} if user cannot be validated
   */
  isSignedIn: async () => {
    const { user } = await validateUserToken(context);
    if (!user.isApproved) {
      throw new AuthorizationError('User is not approved');
    }
  },
  /**
   * Gets the user of the request.
   * @returns The requesting user
   * @throws An {@link AuthenticationError} if user cannot be validated
   */
  getRequestUser: async () => await validateUserToken(context),
}));
