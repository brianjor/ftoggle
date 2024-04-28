-- Custom SQL migration file, put you code below! --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('EDIT_FEATURE_TOGGLE_CONDITION', 'Allows editting a feature toggle condition');
--> statement-breakpoint

WITH
  adminRoleId                AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
  editorRoleId               AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
  editFeatureToggleCondition AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_FEATURE_TOGGLE_CONDITION')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM adminRoleId), (SELECT id FROM editFeatureToggleCondition)),
  ((SELECT id FROM editorRoleId), (SELECT id FROM editFeatureToggleCondition));
