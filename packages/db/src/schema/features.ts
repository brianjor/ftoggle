import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projects } from '.';
import { featuresEnvironments } from './featuresEnvironments';

export const features = pgTable('features', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  modifiedAt: timestamp('modified_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
});

export const featuresRelations = relations(features, ({ one, many }) => ({
  environments: many(featuresEnvironments),
  project: one(projects, {
    fields: [features.projectId],
    references: [projects.id],
  }),
}));
