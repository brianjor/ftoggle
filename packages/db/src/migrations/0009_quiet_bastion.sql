-- Custom SQL migration file, put you code below! --

-- Create VIEW_FEATURE_TOGGLE_CONDITIONS permission --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('VIEW_FEATURE_TOGGLE_CONDITIONS', 'Allows viewing feature toggle conditions');
--> statement-breakpoint

-- Add permission to ADMIN, EDITOR, and VIEWER roles --
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	viewerRoleId    AS (SELECT id FROM "roles" WHERE "name" = 'VIEWER'),
	viewConditionId AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_FEATURE_TOGGLE_CONDITIONS')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM viewConditionId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM viewConditionId)),
	((SELECT id FROM viewerRoleId), (SELECT id FROM viewConditionId));
