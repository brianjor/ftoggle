import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tRolesPermissions } from './rolesPermissions';
import { tUsersRoles } from './usersRoles';

export const tRoles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

export const tRolesRelations = relations(tRoles, ({ many }) => ({
  rolesPermissions: many(tRolesPermissions),
  usersRoles: many(tUsersRoles),
}));
