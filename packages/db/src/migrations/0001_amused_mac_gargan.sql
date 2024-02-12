-- Custom SQL migration file, put you code below! --
-- Create Admin user, with password 'FToggle' --
INSERT INTO "users" ("id", "username") VALUES ('34topp0yykzitqw', 'Admin');--> statement-breakpoint
INSERT INTO "users_passwords" ("user_id", "hashed_password") VALUES ('34topp0yykzitqw', '$argon2id$v=19$m=65536,t=2,p=1$sQXu6euyIHB38+y9o7XbWcMhGeZCilQqeXme+oZcVFk$JHagtUYW8JY6fZDGYGZNmJ2MGkYSP9UY70zq4E6xmCY');--> statement-breakpoint

-- Create user permissions --
INSERT INTO "permissions"
	("name", "description")
VALUES
	('CREATE_USER', 'Allows creation of users'),
	('ADD_ROLE_TO_USER', 'Allows adding a role to a user'),
	('REMOVE_ROLE_FROM_USER', 'Allows removing a role from a user'),
	('VIEW_USERS', 'Allows viewing other users'),
	('ADD_PERMISSION_TO_ROLE', 'Allows adding a permission to a role'),
	('REMOVE_PERMISSON_FROM_ROLE', 'Allows removing a permission from a role'),
  ('CREATE_PROJECT', 'Allows creation of projects');
--> statement-breakpoint

-- Create user roles --
INSERT INTO "roles"
	("name", "description")
VALUES
	('ADMIN', 'Administrative role, has all permissions by default'),
	('EDITOR', 'Role for users who will be creating and managing projects'),
	('VIEWER', 'Role that only allows viewing');
--> statement-breakpoint
-- Add permissions to ADMIN role --
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	createUserId    AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_USER'),
	addRoleId       AS (SELECT id FROM "permissions" WHERE "name" = 'ADD_ROLE_TO_USER'),
	removeRoleId    AS (SELECT id FROM "permissions" WHERE "name" = 'REMOVE_ROLE_FROM_USER'),
	viewUserId      AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_USERS'),
	addPermId       AS (SELECT id FROM "permissions" WHERE "name" = 'ADD_PERMISSION_TO_ROLE'),
	removePermId    AS (SELECT id FROM "permissions" WHERE "name" = 'REMOVE_PERMISSON_FROM_ROLE'),
	createProjectId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM createUserId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM addRoleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM removeRoleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM viewUserId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM addPermId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM removePermId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM createProjectId));
--> statement-breakpoint
-- Add permissions to EDITOR role --
WITH
	editorRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	createProjectId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM editorRoleId), (SELECT id FROM createProjectId));
--> statement-breakpoint
-- VIEWER role has no user permissions :(

-- Give Admin user ADMIN, EDITOR, VIEWER roles --
WITH
	adminUserId  AS (SELECT id FROM "users" WHERE "username" = 'Admin'),
	adminRoleId  AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
  viewerRoleId AS (SELECT id fomr "roles" WHERE "name" = 'VEIWER')
INSERT INTO "users_roles"
	("user_id", "role_id")
VALUES
	((SELECT id FROM adminUserId), (SELECT id FROM adminRoleId)),
	((SELECT id FROM adminUserId), (SELECT id FROM editorRoleId)),
	((SELECT id FROM adminUserId), (SELECT id FROM viewerRoleId))
