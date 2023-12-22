import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projects } from './projects';
import { users } from './users';

export const projectsUsers = pgTable('projects_users', {
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  userId: varchar('userId', { length: 15 })
    .notNull()
    .references(() => users.id),
});

export const projectsUsersRelations = relations(projectsUsers, ({ one }) => ({
  project: one(projects, {
    fields: [projectsUsers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectsUsers.userId],
    references: [users.id],
  }),
}));
