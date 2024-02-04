import Elysia, { Context } from 'elysia';
import { lucia } from '../auth/lucia';
import { AuthenticationError } from '../errors/apiErrors';

/**
 * Validates the token for the user of the request.
 * @param context The request context
 * @returns The user making the request
 * @throws An {@link AuthenticationError} if user cannot be validated
 */
const validateUserToken = async (context: Context) => {
  const authHeader = context.headers['authorization'];
  const sessionId = lucia.readBearerToken(authHeader ?? '');
  if (!sessionId) {
    throw new AuthenticationError('Unable to authenticate user');
  }
  const { session, user } = await lucia.validateSession(sessionId);
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
    await validateUserToken(context);
  },
  /**
   * Gets the user of the request.
   * @returns The requesting user
   * @throws An {@link AuthenticationError} if user cannot be validated
   */
  getRequestUser: async () => await validateUserToken(context),
}));
