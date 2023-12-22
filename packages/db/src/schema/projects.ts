import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projectsUsers } from './projectsUsers';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  modifiedAt: timestamp('modified_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  projectsUsers: many(projectsUsers),
}));