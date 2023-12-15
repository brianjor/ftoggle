import { Context } from 'elysia';
import { auth } from '../auth/lucia';
import { AuthenticationError } from '../errors/apiErrors';

/**
 * Checks if a user is signed in. If they are not: an {@link AuthenticationError} is thrown.
 * @param context Request context
 * @throws An {@link AuthenticationError} if session is missing or invalid
 */
export const isSignedIn = async (context: Context) => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validateBearerToken();
  if (!session) {
    throw new AuthenticationError('Unable to authenticate user');
  }
};
