-- Custom SQL migration file, put you code below! --

-- Create new project permission --
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('DELETE_PROJECT_API_TOKEN', 'Allows deleting project API tokens');
--> statement-breakpoint

-- Add permission to PROJECT_OWNER and PROJECT_MEMBER
WITH
  projectOwnerRole  AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_OWNER'),
  projectMemberRole AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_MEMBER'),
  deleteApiTokenId  AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_API_TOKEN')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM projectOwnerRole),  (SELECT id from deleteApiTokenId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from deleteApiTokenId));
