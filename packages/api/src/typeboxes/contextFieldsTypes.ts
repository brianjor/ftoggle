import { Static, t } from 'elysia';

/** DTO of a context field from the `context_fields` table. */
export const contextFieldsTableItem = t.Object({
  id: t.String(),
  projectId: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
});

export type ContextFieldsTableItem = Static<typeof contextFieldsTableItem>;
