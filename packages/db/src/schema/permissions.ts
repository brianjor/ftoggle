import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { rolesPermissions } from './rolesPermissions';

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolesPermissions: many(rolesPermissions),
}));
