-- Custom SQL migration file, put you code below! --
INSERT INTO "permissions"
	("name", "description")
VALUES
	('CREATE_USER', 'Allows creation of users'),
	('ADD_ROLE_TO_USER', 'Allows adding a role to a user'),
	('REMOVE_ROLE_FROM_USER', 'Allows removing a role from a user'),
	('VIEW_USERS', 'Allows viewing other users'),
	('CREATE_FEATURE_TOGGLE', 'Allows creating a feature toggle'),
	('EDIT_FEATURE_TOGGLE', 'Allows editing a feature toggle'),
	('VIEW_FEATURE_TOGGLE', 'Allows viewing a feature toggle'),
	('ADD_PERMISSION_TO_ROLE', 'Allows adding a permission to a role'),
	('REMOVE_PERMISSON_FROM_ROLE', 'Allows removing a permission from a role');
--> statement-breakpoint
INSERT INTO "roles"
	("name", "description")
VALUES
	('ADMIN', 'Administrative role, has all permissions by default'),
	('EDITOR', 'Role for users who will be creating and managing feature toggles'),
	('VIEWER', 'Role that only allows viewing permissions of feature toggle statuses');
--> statement-breakpoint
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	createUserId    AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_USER'),
	addRoleId       AS (SELECT id FROM "permissions" WHERE "name" = 'ADD_ROLE_TO_USER'),
	removeRoleId    AS (SELECT id FROM "permissions" WHERE "name" = 'REMOVE_ROLE_FROM_USER'),
	viewUserId      AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_USERS'),
	createFeatureId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_FEATURE_TOGGLE'),
	editFeatureId   AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_FEATURE_TOGGLE'),
	viewFeatureId   AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_FEATURE_TOGGLE'),
	addPermId       AS (SELECT id FROM "permissions" WHERE "name" = 'ADD_PERMISSION_TO_ROLE'),
	removePermId    AS (SELECT id FROM "permissions" WHERE "name" = 'REMOVE_PERMISSON_FROM_ROLE')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM createUserId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM addRoleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM removeRoleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM viewUserId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM createFeatureId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM editFeatureId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM viewFeatureId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM addPermId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM removePermId));
--> statement-breakpoint
WITH
	editorRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	createFeatureId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_FEATURE_TOGGLE'),
	editFeatureId   AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_FEATURE_TOGGLE'),
	viewFeatureId   AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_FEATURE_TOGGLE')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM editorRoleId), (SELECT id FROM createFeatureId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM editFeatureId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM viewFeatureId));
--> statement-breakpoint
WITH
	viewerRoleId  AS (SELECT id FROM "roles" WHERE "name" = 'VIEWER'),
	viewFeatureId AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_FEATURE_TOGGLE')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM viewerRoleId), (SELECT id FROM viewFeatureId));
--> statement-breakpoint
WITH
	adminId AS (SELECT id FROM "users" WHERE "username" = 'Admin'),
	adminRoleId AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN')
INSERT INTO "users_roles"
	("user_id", "role_id")
VALUES
	((SELECT id FROM adminId), (SELECT id FROM adminRoleId))
