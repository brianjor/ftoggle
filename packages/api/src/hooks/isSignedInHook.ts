import { Context } from 'elysia';
import { auth } from '../auth/lucia';
import { AuthenticationError } from '../errors/apiErrors';

/**
 * Checks if user is signed in, adding them to the store if they are. If the user
 * is not validated: an {@link AuthenticationError} is thrown.
 * @param context Request context
 * @returns adds the validated user to the store
 * @throws An {@link AuthenticationError} if user session is missing or invalid.
 */
export const isSignedIn = async (context: Context) => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validateBearerToken();
  if (!session) {
    throw new AuthenticationError('Unable to authenticate user');
  }
  return {
    store: {
      user: session.user,
    },
  };
};
