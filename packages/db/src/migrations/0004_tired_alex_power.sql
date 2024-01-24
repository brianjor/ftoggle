-- Create new permission
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('CREATE_PROJECT_API_TOKEN', 'Allows creating project API tokens');
--> statement-breakpoint

-- Give permission to PROJECT_OWN and PROJECT_MEMBER roles
WITH
  projectOwnerRole  AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_OWNER'),
  projectMemberRole AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_MEMBER'),
  createApiTokenId  AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_API_TOKEN')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM projectOwnerRole), (SELECT id from createApiTokenId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from createApiTokenId));
