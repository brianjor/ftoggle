import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { environments, projects } from '.';

export const apiTokens = pgTable('api_tokens', {
  id: uuid('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  environmentId: integer('environment_id')
    .notNull()
    .references(() => environments.id),
  name: text('name').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
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
}));
