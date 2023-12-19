import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { rolesPermissions } from './rolesPermissions';
import { relations } from 'drizzle-orm';
import { usersRoles } from './usersRoles';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  rolesPermissions: many(rolesPermissions),
  usersRoles: many(usersRoles),
}));
