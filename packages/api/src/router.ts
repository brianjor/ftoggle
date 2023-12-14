import { FeaturesController } from './controllers/featuresController';
import {
  AuthHandler,
  AuthLoginSchema,
  AuthLogoutSchema,
  AuthSignupSchema,
} from './handlers/authHandler';
import { FeatureGetSchema, FeatureHandler } from './handlers/featureHandler';
import {
  FeaturesHandler,
  FeaturesGetSchema,
  FeaturesPostSchema,
} from './handlers/featuresHandler';
import { isSignedIn } from './hooks/isSignedInHook';
import { App } from './index';

const featuresController = new FeaturesController();
const featuresHandler = new FeaturesHandler(featuresController);
const featureHandler = new FeatureHandler(featuresController);

const authHandler = new AuthHandler();

export class Router {
  static route(app: App) {
    app
      .group('/features', (featuresGroup) =>
        featuresGroup
          .onBeforeHandle([isSignedIn])
          .get('', featuresHandler.handleGet, FeaturesGetSchema)
          .post('', featuresHandler.handlePost, FeaturesPostSchema)
          .get('/:featureId', featureHandler.handleGet, FeatureGetSchema),
      )
      .group('/auth', (authGroup) =>
        authGroup
          .post('/signup', authHandler.handleSignup, AuthSignupSchema)
          .post('/login', authHandler.handleLogin, AuthLoginSchema)
          .onBeforeHandle([isSignedIn])
          .post('/logout', authHandler.handleLogout, AuthLogoutSchema),
      );
  }
}
