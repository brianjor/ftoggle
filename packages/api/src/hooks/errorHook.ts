import { ErrorHandler } from 'elysia';
import { AuthenticationError } from '../errors/apiErrors';

/** Hook to handle errors thrown by the api. */
export const errorHook: ErrorHandler = ({ error }) => {
  if (error instanceof AuthenticationError) {
    return new Response(error.message, { status: 401 });
  }
  return new Response('Internal Server Error', { status: 500 });
};
