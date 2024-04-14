import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tRolesPermissions } from './rolesPermissions';

export const tPermissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

export const tPermissionsRelations = relations(tPermissions, ({ many }) => ({
  rolesPermissions: many(tRolesPermissions),
}));
