-- Custom SQL migration file, put you code below! --
-- Insert CREATE_PROJECT permission
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('CREATE_PROJECT', 'Allows creating a project');
--> statement-breakpoint
-- Give CREATE_PROJECT permission to Admin role
WITH
	adminRoleId     AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	createProjectId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id from adminRoleId), (SELECT id FROM createProjectId))
