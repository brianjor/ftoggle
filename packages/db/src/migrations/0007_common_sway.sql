-- Custom SQL migration file, put you code below! --

-- Create CREATE_FEATURE_TOGGLE_CONDITION permission --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('CREATE_FEATURE_TOGGLE_CONDITION', 'Allows creating a condition for a feature toggle');
--> statement-breakpoint

-- Add permission to ADMIN and EDITOR roles --
WITH
	adminRoleId       AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId      AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	createConditionId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_FEATURE_TOGGLE_CONDITION')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM createConditionId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM createConditionId));
