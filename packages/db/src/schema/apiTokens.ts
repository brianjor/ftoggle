import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { environments, projects, users } from '.';

export const apiTokens = pgTable('api_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  environmentId: integer('environment_id')
    .notNull()
    .references(() => environments.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});

export const apiTokensRelations = relations(apiTokens, ({ one }) => ({
  project: one(projects, {
    fields: [apiTokens.projectId],
    references: [projects.id],
  }),
  environment: one(environments, {
    fields: [apiTokens.environmentId],
    references: [environments.id],
  }),
  user: one(users, {
    fields: [apiTokens.userId],
    references: [users.id],
  }),
}));
