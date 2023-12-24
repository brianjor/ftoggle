import Elysia from 'elysia';
import { isSignedIn } from './isSignedInHook';
import { hasPermissions } from './requiresPermissionHook';

export const hooks = new Elysia({ name: 'hooks' })
  .use(isSignedIn)
  .use(hasPermissions);
