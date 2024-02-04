-- Custom SQL migration file, put you code below! --
-- Add project permissions
INSERT INTO "permissions"
  ("name", "description")
VALUES
  ('EDIT_PROJECT', 'Allows editing a project'),
  ('DELETE_PROJECT', 'Allows deleting a project'),
  ('ADD_PROJECT_USER', 'Allows adding a user to a project'),
  ('REMOVE_PROJECT_USER', 'Allows removing a user from a project'),
  ('VIEW_PROJECT_USERS', 'Allows viewing the users of a project'),
  ('CREATE_PROJECT_FEATURE_TOGGLE', 'Allows creating a feature toggle for a project'),
  ('EDIT_PROJECT_FEATURE_TOGGLE', 'Allows editing a feature toggle for a project'),
  ('DELETE_PROJECT_FEATURE_TOGGLE', 'Allows deleting a feature toggle for a project'),
  ('VIEW_PROJECT_FEATURE_TOGGLES', 'Allows viewing the features toggles of a project'),
  ('CREATE_PROJECT_ENVIRONMENT', 'Allows creating an environment for a project'),
  ('EDIT_PROJECT_ENVIRONMENT', 'Allows editing an environment for a project'),
  ('DELETE_PROJECT_ENVIRONMENT', 'Allows deleting an environment from a project'),
  ('VIEW_PROJECT_ENVIRONMENTS', 'Allows viewing environments of a project'),
  ('CREATE_PROJECT_API_TOKEN', 'Allows creating project API tokens'),
  ('VIEW_PROJECT_API_TOKENS', 'Allows viewing project API tokens'),
  ('DELETE_PROJECT_API_TOKEN', 'Allows deleting project API tokens'),
  ('VIEW_PROJECT', 'Allows veiwing the project');
--> statement-breakpoint
-- Add project level roles
INSERT INTO "roles"
  ("name", "description")
VALUES
  ('PROJECT_OWNER', 'Owner of the project. Has all permissions'),
  ('PROJECT_MEMBER', 'Project member. Has read/create/modify/delete permissions for feature toggles and environments'),
  ('PROJECT_VIEWER', 'Only allowed to view the project');
--> statement-breakpoint
-- Add permissions to PROJECT_OWNER role
WITH
  projectOwnerRole      AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_OWNER'),
  editProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_PROJECT'),
  deleteProjectId       AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT'),
  addUserId             AS (SELECT id FROM "permissions" WHERE "name" = 'ADD_PROJECT_USER'),
  removeUserId          AS (SELECT id FROM "permissions" WHERE "name" = 'REMOVE_PROJECT_USER'),
  viewUsersId           AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_USERS'),
  createFeatureToggleId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_FEATURE_TOGGLE'),
  editFeatureToggleId   AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_PROJECT_FEATURE_TOGGLE'),
  deleteFeatureToggleId AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_FEATURE_TOGGLE'),
  viewFeatureTogglesId  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_FEATURE_TOGGLES'),
  createEnvironmentId   AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_ENVIRONMENT'),
  editEnvironmentId     AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_PROJECT_ENVIRONMENT'),
  deleteEnvironmentId   AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_ENVIRONMENT'),
  viewEnvironmentsId    AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_ENVIRONMENTS'),
  createApiTokenId      AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_API_TOKEN'),
  viewProjectApiTokens  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_API_TOKENS'),
  deleteApiTokenId      AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_API_TOKEN'),
  viewProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM projectOwnerRole), (SELECT id from editProjectId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from deleteProjectId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from addUserId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from removeUserId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from viewUsersId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from createFeatureToggleId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from editFeatureToggleId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from deleteFeatureToggleId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from viewFeatureTogglesId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from createEnvironmentId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from editEnvironmentId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from deleteEnvironmentId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from viewEnvironmentsId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from createApiTokenId)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from viewProjectApiTokens)),
  ((SELECT id FROM projectOwnerRole), (SELECT id from deleteApiTokenId)),
  ((SELECT id FROM projectOwnerRole),  (SELECT id from viewProjectId));
--> statement-breakpoint
-- Add permissions to PROJECT_MEMBER role
WITH
  projectMemberRole     AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_MEMBER'),
  viewUsersId           AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_USERS'),
  createFeatureToggleId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_FEATURE_TOGGLE'),
  editFeatureToggleId   AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_PROJECT_FEATURE_TOGGLE'),
  deleteFeatureToggleId AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_FEATURE_TOGGLE'),
  viewFeatureTogglesId  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_FEATURE_TOGGLES'),
  createEnvironmentId   AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_ENVIRONMENT'),
  editEnvironmentId     AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_PROJECT_ENVIRONMENT'),
  deleteEnvironmentId   AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_ENVIRONMENT'),
  viewEnvironmentsId    AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_ENVIRONMENTS'),
  createApiTokenId      AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_API_TOKEN'),
  viewProjectApiTokens  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_API_TOKENS'),
  deleteApiTokenId      AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_API_TOKEN'),
  viewProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM projectMemberRole), (SELECT id from viewUsersId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from createFeatureToggleId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from editFeatureToggleId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from deleteFeatureToggleId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from viewFeatureTogglesId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from createEnvironmentId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from editEnvironmentId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from deleteEnvironmentId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from viewEnvironmentsId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from createApiTokenId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from viewProjectApiTokens)),
  ((SELECT id FROM projectMemberRole), (SELECT id from deleteApiTokenId)),
  ((SELECT id FROM projectMemberRole), (SELECT id from viewProjectId));
--> statement-breakpoint
-- Add permisions to PROJECT_VIEWER role
WITH
  projectViewerRole     AS (SELECT id FROM "roles" WHERE "name" = 'PROJECT_VIEWER'),
  viewUsersId           AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_USERS'),
  viewFeatureTogglesId  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_FEATURE_TOGGLES'),
  viewEnvironmentsId    AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_ENVIRONMENTS'),
  viewProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT')
INSERT INTO "roles_permissions"
  ("role_id", "permission_id")
VALUES
  ((SELECT id FROM projectViewerRole), (SELECT id from viewUsersId)),
  ((SELECT id FROM projectViewerRole), (SELECT id from viewFeatureTogglesId)),
  ((SELECT id FROM projectViewerRole), (SELECT id from viewEnvironmentsId)),
  ((SELECT id FROM projectViewerRole), (SELECT id from viewProjectId));
