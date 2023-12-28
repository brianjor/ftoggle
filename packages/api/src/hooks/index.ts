import Elysia from 'elysia';
import { hasPermissions } from './requiresPermissionHook';

export const hooks = new Elysia({ name: 'hooks' }).use(hasPermissions);
