import Elysia from 'elysia';
import { authRouters } from './authRoutes';
import { featuresRoutes } from './featuresRoutes';

export const routes = new Elysia().use(authRouters).use(featuresRoutes);
