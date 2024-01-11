import { t } from 'elysia';

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  /** Unable to authenticate the user */
  Unauthorized = 401,
  /** Missing required permissions */
  Forbbiden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export const errorResponseObject = (options: {
  status: HttpStatus;
  error?: string;
}) =>
  t.Object({
    status: t.Number({ example: options.status }),
    error: t.String({ example: options.error ?? '' }),
    message: t.String({ example: '' }),
  });

/** Response schema for 400 errors */
export const BadRequestResponse = errorResponseObject({
  status: HttpStatus.BadRequest,
  error: 'Bad Request',
});
/** Response schema for 401 errors. Ex: Unable to authenticate the user. */
export const UnathorizedResponse = errorResponseObject({
  status: HttpStatus.Unauthorized,
  error: 'Unathorized',
});
/** Response schema for 403 errors. Ex: User is missing permissions. */
export const ForbiddenResponse = errorResponseObject({
  status: HttpStatus.Forbbiden,
  error: 'Forbidden',
});
/** Response schema for 404 errors */
export const NotFoundResponse = errorResponseObject({
  status: HttpStatus.NotFound,
  error: 'Not Found',
});
