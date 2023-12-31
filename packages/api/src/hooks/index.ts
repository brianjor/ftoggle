import Elysia from 'elysia';
import { requestUserHooks } from './requestUserHooks';
import { hasPermissions } from './requiresPermissionHook';

export const hooks = new Elysia({ name: 'hooks' })
  .use(hasPermissions)
  .use(requestUserHooks);
