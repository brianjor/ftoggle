import Elysia from 'elysia';
import { authRouters } from './authRoutes';
import { featuresRoutes } from './featuresRoutes';
import { projectsRoutes } from './projects/projectsRoutes';

export const routes = new Elysia()
  .use(authRouters)
  .use(featuresRoutes)
  .use(projectsRoutes);
