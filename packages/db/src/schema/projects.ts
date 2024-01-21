import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { environments } from './environments';
import { features } from './features';
import { projectsUsers } from './projectsUsers';

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  modifiedAt: timestamp('modified_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  isArchived: boolean('is_archived').notNull().default(false),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  environments: many(environments),
  features: many(features),
  projectsUsers: many(projectsUsers),
}));
