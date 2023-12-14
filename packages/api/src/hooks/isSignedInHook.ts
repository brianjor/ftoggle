import { Handler } from 'elysia';
import { auth } from '../auth/lucia';
import { AuthenticationError } from '../errors/apiErrors';

/**
 * Checks if a user is signed in. If they are not: an Unauthorized error is thrown.
 * @param context Request context
 * @throws An {@link UnauthorizedError} if session is missing or invalid
 */
export const isSignedIn: Handler = async (context) => {
  console.log('in isSignedIn hook');
  const authRequest = auth.handleRequest(context);
  // Requires same-origin in request, otherwise returns null. Set "Origin" header.
  const session = await authRequest.validate();
  if (!session) {
    throw new AuthenticationError('Unable to authenticate user');
  }
};
