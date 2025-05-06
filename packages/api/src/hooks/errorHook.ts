import type { ErrorHandler } from 'elysia';
import postgres from 'postgres';
import {
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
} from '../errors/apiErrors';
import {
  DuplicateRecordError,
  RecordDoesNotExistError,
} from '../errors/dbErrors';

/** Hook to handle errors thrown by the api. */
export const errorHook: ErrorHandler = (context) => {
  const { code, error } = context;
  if (code === 'VALIDATION') {
    return new Response(JSON.stringify(error), { status: 400 });
  }
  if (
    error instanceof DuplicateRecordError ||
    error instanceof BadRequestError
  ) {
    return new Response(error.message, { status: 400 });
  }
  if (error instanceof AuthenticationError) {
    return new Response(error.message, { status: 401 });
  }
  if (error instanceof AuthorizationError) {
    return new Response(error.message, { status: 403 });
  }
  if (error instanceof RecordDoesNotExistError) {
    return new Response(error.message, { status: 404 });
  }
  if (error instanceof postgres.PostgresError) {
    return handlePostgresErrors(context);
  }
  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  }
  return new Response('Internal Server Error', { status: 500 });
};

const POSTGRES_DUPLICATE_USERNAME_ERROR_MESSAGE =
  'duplicate key value violates unique constraint "users_username_unique"';

const POSTGRES_DUPLICATE_PROJECT_USER_ERROR_MESSAGE =
  'duplicate key value violates unique constraint "projects_users_project_id_userId_pk"';

const handlePostgresErrors: ErrorHandler = ({ error }) => {
  if (error instanceof Error) {
    if (error.message === POSTGRES_DUPLICATE_USERNAME_ERROR_MESSAGE) {
      return new Response('User with that username already exists.', {
        status: 400,
      });
    }
    if (error.message === POSTGRES_DUPLICATE_PROJECT_USER_ERROR_MESSAGE) {
      return new Response('User is already a project user of the project.', {
        status: 400,
      });
    }
    console.error(error.message);
    console.error(error.stack);
  }
  return new Response('Internal Server Error', { status: 500 });
};
