-- Custom SQL migration file, put you code below! --

-- Create VIEW_PROJECT permission
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('VIEW_PROJECT', 'Allows veiwing the project');
--> statement-breakpoint

-- Add permission to PROJECT_OWNER, PROJECT_MEMBER, and PROJECT_VIEWER roles
WITH
  projectOwnerRole  AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_OWNER'),
  projectMemberRole AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_MEMBER'),
  projectViewerRole AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_VIEWER'),
  viewProjectId     AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM projectOwnerRole),  (SELECT id from viewProjectId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from viewProjectId)),
  ((SELECT id FROM projectViewerRole), (SELECT id from viewProjectId));
