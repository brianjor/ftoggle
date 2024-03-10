-- Custom SQL migration file, put you code below! --

-- Create DELETE_FEATURE_TOGGLE_CONDITION permission --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('DELETE_FEATURE_TOGGLE_CONDITION', 'Allows deleting a feature toggles condition');
--> statement-breakpoint

-- Add permission to ADMIN and EDITOR roles --
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	deleteContextId AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_FEATURE_TOGGLE_CONDITION')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM deleteContextId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM deleteContextId));
