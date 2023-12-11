import { Context, t } from 'elysia';
import { FeaturesController } from '../controllers/featuresController';

export type FeaturesPostContext = Context<{
  body: { name: string };
  response: string;
}>;

export type FeaturesGetContext = Context<{
  response: {
    data: {
      features: {
        id: number;
        name: string;
        enabled: boolean;
        createdAt: Date;
        modifiedAt: Date;
      }[];
    };
  };
}>;

export const FeaturesGetSchema = {
  response: {
    200: t.Object({
      data: t.Object({
        features: t.Array(
          t.Object({
            id: t.Number(),
            name: t.String(),
            enabled: t.Boolean(),
            createdAt: t.Date(),
            modifiedAt: t.Date(),
          }),
        ),
      }),
    }),
  },
};

export const FeaturesPostSchema = {
  body: t.Object({
    name: t.String(),
  }),
  response: {
    200: t.String(),
  },
};

export class FeaturesHandler {
  constructor(private controller: FeaturesController) {}

  public handleGet = async ({ set }: FeaturesGetContext) => {
    const features = await this.controller.getFeatures();
    const response = {
      data: {
        features,
      },
    };
    set.status = 200;
    return response;
  };

  public handlePost = async ({ set, body }: FeaturesPostContext) => {
    const name = body.name;
    await this.controller.addFeature(name);
    set.status = 200;
    return 'Successfully added feature!';
  };
}
