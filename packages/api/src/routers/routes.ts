import Elysia from 'elysia';
import { authRouters } from './authRoutes';
import { projectsRoutes } from './projects/projectsRoutes';

export const routes = new Elysia().use(authRouters).use(projectsRoutes);
