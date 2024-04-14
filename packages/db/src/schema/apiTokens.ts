import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { tEnvironments, tProjects, tUsers } from '.';

export const tApiTokens = pgTable('api_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: text('project_id')
    .notNull()
    .references(() => tProjects.id, { onDelete: 'cascade' }),
  environmentId: uuid('environment_id')
    .notNull()
    .references(() => tEnvironments.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: text('user_id')
    .notNull()
    .references(() => tUsers.id),
});

export const tApiTokensRelations = relations(tApiTokens, ({ one }) => ({
  project: one(tProjects, {
    fields: [tApiTokens.projectId],
    references: [tProjects.id],
  }),
  environment: one(tEnvironments, {
    fields: [tApiTokens.environmentId],
    references: [tEnvironments.id],
  }),
  user: one(tUsers, {
    fields: [tApiTokens.userId],
    references: [tUsers.id],
  }),
}));
