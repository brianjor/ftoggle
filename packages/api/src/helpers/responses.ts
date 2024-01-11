import { t } from 'elysia';

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbbiden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export const errorResponseObject = (status: HttpStatus) =>
  t.Object({
    status: t.Number({ example: status }),
    error: t.String(),
    message: t.String(),
  });

/** Response schema for 400 errors */
export const BadRequestResponse = errorResponseObject(HttpStatus.BadRequest);
/** Response schema for 401 errors */
export const UnathorizedResponse = errorResponseObject(HttpStatus.Unauthorized);
/** Response schema for 403 errors */
export const ForbiddenResponse = errorResponseObject(HttpStatus.Forbbiden);
/** Response schema for 404 errors */
export const NotFoundResponse = errorResponseObject(HttpStatus.NotFound);
