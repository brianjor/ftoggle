import { Static, t } from 'elysia';

export const getFeaturesItem = t.Object({
  id: t.Number(),
  name: t.String(),
  environments: t.Array(
    t.Object({
      isEnabled: t.Boolean(),
      id: t.Number(),
      name: t.String(),
    }),
  ),
});

export type GetFeaturesItem = Static<typeof getFeaturesItem>;
