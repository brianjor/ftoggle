-- Custom SQL migration file, put you code below! --
-- Add new permission VIEW_PROJECT_API_TOKENS
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('VIEW_PROJECT_API_TOKENS', 'Allows viewing project API tokens');
--> statement-breakpoint

-- Add permission to PROJECT_OWNER and PROJECT_MEMBER
WITH
	projectOwnerRole     AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_OWNER'),
	projectMemberRole    AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_MEMBER'),
  viewProjectApiTokens AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_API_TOKENS')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM projectOwnerRole),  (SELECT id from viewProjectApiTokens)),
  ((SELECT id FROM projectMemberRole), (SELECT id from viewProjectApiTokens));
