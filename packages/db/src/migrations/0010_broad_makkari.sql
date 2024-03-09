-- Custom SQL migration file, put you code below! --

-- Create VIEW_PROJECT_CONTEXT_FIELDS permission --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('VIEW_PROJECT_CONTEXT_FIELDS', 'Allows viewing a projects context fields');
--> statement-breakpoint

-- Add permission to ADMIN, EDITOR, and VIEWER roles --
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	viewerRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'VIEWER'),
	createContextId AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_CONTEXT_FIELDS')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM createContextId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM createContextId)),
	((SELECT id FROM viewerRoleId), (SELECT id FROM createContextId));
