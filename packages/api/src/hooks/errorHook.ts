import { ErrorHandler } from 'elysia';
import { AuthenticationError, AuthorizationError } from '../errors/apiErrors';
import postgres from 'postgres';

/** Hook to handle errors thrown by the api. */
export const errorHook: ErrorHandler = (context) => {
  const { error } = context;
  if (error instanceof AuthenticationError) {
    return new Response(error.message, { status: 401 });
  } else if (error instanceof AuthorizationError) {
    return new Response(error.message, { status: 403 });
  } else if (error instanceof postgres.PostgresError) {
    return handlePostgresErrors(context);
  }
  console.error(error.message);
  return new Response('Internal Server Error', { status: 500 });
};

const POSTGRES_DUPLICATE_USERNAME_ERROR_MESSAGE =
  'duplicate key value violates unique constraint "users_username_unique"';

const handlePostgresErrors: ErrorHandler = ({ error }) => {
  if (error.message === POSTGRES_DUPLICATE_USERNAME_ERROR_MESSAGE) {
    return new Response('User with that username already exists.', {
      status: 400,
    });
  }
};
