import Elysia from 'elysia';
import { FeaturesController } from './controllers/featuresController';
import { EPermissions } from './enums/permissions';
import {
  AuthHandler,
  AuthLoginSchema,
  AuthLogoutSchema,
  AuthSignupSchema,
} from './handlers/authHandler';
import { FeatureGetSchema, FeatureHandler } from './handlers/featureHandler';
import {
  FeaturesGetSchema,
  FeaturesHandler,
  FeaturesPostSchema,
} from './handlers/featuresHandler';
import { isSignedIn } from './hooks/isSignedInHook';
import { requiresPermissions } from './hooks/requiresPermissionHook';

const featuresController = new FeaturesController();
const featuresHandler = new FeaturesHandler(featuresController);
const featureHandler = new FeatureHandler(featuresController);

const authHandler = new AuthHandler();

export const routes = new Elysia()
  .post('/auth/login', authHandler.handleLogin, AuthLoginSchema)
  .onBeforeHandle([isSignedIn])
  .post('/auth/logout', authHandler.handleLogout, AuthLogoutSchema)
  .onBeforeHandle([isSignedIn])
  .get('/features', featuresHandler.handleGet, FeaturesGetSchema)
  .onBeforeHandle([isSignedIn])
  .post('/features', featuresHandler.handlePost, FeaturesPostSchema)
  .onBeforeHandle([isSignedIn])
  .get('/features/:featureId', featureHandler.handleGet, FeatureGetSchema)
  .onBeforeHandle([isSignedIn, requiresPermissions([EPermissions.CREATE_USER])])
  .post('/auth/signup', authHandler.handleSignup, AuthSignupSchema);
