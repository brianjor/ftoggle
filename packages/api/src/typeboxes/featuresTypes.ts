import { Static, t } from 'elysia';

/** DTO of a feature from the `features` table. */
export const FeaturesTableItem = t.Object({
  id: t.Number(),
  name: t.String(),
  isEnabled: t.Boolean(),
  createdAt: t.Date(),
  modifiedAt: t.Date(),
  projectId: t.Number(),
});

export type FeaturesTableItem = Static<typeof FeaturesTableItem>;

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
