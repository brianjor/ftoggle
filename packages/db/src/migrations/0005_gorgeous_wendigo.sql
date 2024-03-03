-- Custom SQL migration file, put you code below! --

-- Create CREATE_PROJECT_CONTEXT_FIELD permission --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('CREATE_PROJECT_CONTEXT_FIELD', 'Allows create a context field on a project');
--> statement-breakpoint

-- Add permission to ADMIN and EDITOR roles --
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	createContextId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_CONTEXT_FIELD')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM createContextId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM createContextId));
