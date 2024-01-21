import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { projects } from './projects';
import { projectsUsers } from './projectsUsers';
import { roles } from './roles';
import { users } from './users';

export const projectsUsersRoles = pgTable(
  'projects_users_roles',
  {
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
    projectId: text('project_id').notNull(),
    userId: varchar('user_id', { length: 15 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.projectId, t.userId] }),
    projectsUsersForeignKey: foreignKey({
      columns: [t.projectId, t.userId],
      foreignColumns: [projectsUsers.projectId, projectsUsers.userId],
      name: 'projects_users_fk',
    }),
  }),
);

export const projectsUsersRolesRelations = relations(
  projectsUsersRoles,
  ({ one }) => ({
    role: one(roles, {
      fields: [projectsUsersRoles.roleId],
      references: [roles.id],
    }),
    project: one(projects, {
      fields: [projectsUsersRoles.projectId],
      references: [projects.id],
    }),
    projectUser: one(projectsUsers, {
      fields: [projectsUsersRoles.projectId, projectsUsersRoles.userId],
      references: [projectsUsers.projectId, projectsUsers.userId],
    }),
    user: one(users, {
      fields: [projectsUsersRoles.userId],
      references: [users.id],
    }),
  }),
);
