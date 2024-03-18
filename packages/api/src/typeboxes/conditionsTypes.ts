import { Static, t } from 'elysia';
import { contextFieldsTableItem } from './contextFieldsTypes';

/** DTO of a condition from the `conditions` table. */
export const conditionsTableItem = t.Object({
  id: t.String(),
  projectId: t.String(),
  featureId: t.Number(),
  environmentId: t.Number(),
  contextFieldId: t.String(),
  operator: t.String(),
  description: t.Nullable(t.String()),
  values: t.Array(t.String()),
});

/** DTO of a condition from the `conditions` table. */
export type ConditionsTableItem = Static<typeof conditionsTableItem>;

export const conditionWithContextField = t.Composite([
  conditionsTableItem,
  t.Object({
    contextField: contextFieldsTableItem,
  }),
]);

export type ConditionWithContextField = Static<
  typeof conditionWithContextField
>;
