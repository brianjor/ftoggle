import { FeaturesController } from './controllers/featuresController';
import { FeatureGetSchema, FeatureHandler } from './handlers/featureHandler';
import {
  FeaturesHandler,
  FeaturesGetSchema,
  FeaturesPostSchema,
} from './handlers/featuresHandler';
import { App } from './index';

const featuresController = new FeaturesController();
const featuresHandler = new FeaturesHandler(featuresController);
const featureHandler = new FeatureHandler(featuresController);

export class Router {
  static route(app: App) {
    app.group('/features', (featuresGroup) =>
      featuresGroup
        .get('', featuresHandler.handleGet, FeaturesGetSchema)
        .post('', featuresHandler.handlePost, FeaturesPostSchema)
        .get('/:featureId', featureHandler.handleGet, FeatureGetSchema),
    );
  }
}
