import { Context, t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';

export type FeatureGetContext = Context<{
  params: {
    featureId: number;
  };
  response:
    | {
        data: {
          feature: {
            id: number;
            name: string;
            enabled: boolean;
            createdAt: Date;
            modifiedAt: Date;
          };
        };
      }
    | string;
}>;

export const FeatureGetSchema = {
  params: t.Object({
    featureId: t.Numeric(),
  }),
  response: {
    200: t.Object({
      data: t.Object({
        feature: t.Object({
          id: t.Number(),
          name: t.String(),
          enabled: t.Boolean(),
          createdAt: t.Date(),
          modifiedAt: t.Date(),
        }),
      }),
    }),
    404: t.String(),
  },
};

export class FeatureHandler {
  constructor(private controller: FeaturesController) {}

  public handleGet = async ({ set, params }: FeatureGetContext) => {
    const featureId = params.featureId;
    const feature = await this.controller.getFeature(featureId);
    const response = {
      data: {
        feature: feature[0],
      },
    };
    set.status = 200;
    return response;
  };
}
