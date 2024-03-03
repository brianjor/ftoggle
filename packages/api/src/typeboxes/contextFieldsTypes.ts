import { t } from 'elysia';

export const contextFieldTableItem = t.Object({
  id: t.String(),
  projectId: t.String(),
  name: t.String(),
  description: t.String(),
});
