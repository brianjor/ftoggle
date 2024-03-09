-- Custom SQL migration file, put you code below! --

-- Create DELETE_PROJECT_CONTEXT_FIELD permission --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('DELETE_PROJECT_CONTEXT_FIELD', 'Allows deleting a projects context fields');
--> statement-breakpoint

-- Add permission to ADMIN and EDITOR roles --
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	deleteContextId AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_CONTEXT_FIELD')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM deleteContextId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM deleteContextId));
