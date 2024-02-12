-- Custom SQL migration file, put you code below! --

-- Create 'Admin' user, with password 'FToggle' --
INSERT INTO "users"
("id", "username", "is_approved")
VALUES ('34topp0yykzitqw', 'Admin', true);
--> statement-breakpoint
INSERT INTO "users_passwords"
("user_id", "hashed_password")
VALUES ('34topp0yykzitqw', '$argon2id$v=19$m=65536,t=2,p=1$sQXu6euyIHB38+y9o7XbWcMhGeZCilQqeXme+oZcVFk$JHagtUYW8JY6fZDGYGZNmJ2MGkYSP9UY70zq4E6xmCY');
--> statement-breakpoint

-- Create user permissions --
INSERT INTO "permissions"
	("name", "description")
VALUES
	('CREATE_USER', 'Allows creation of users'),
  ('CHANGE_USERS_APPROVAL', 'Allows changing a users approval'),
	('ADD_ROLE_TO_USER', 'Allows adding a role to a user'),
	('REMOVE_ROLE_FROM_USER', 'Allows removing a role from a user'),
	('VIEW_USERS', 'Allows viewing other users'),
	('ADD_PERMISSION_TO_ROLE', 'Allows adding a permission to a role'),
	('REMOVE_PERMISSON_FROM_ROLE', 'Allows removing a permission from a role'),
  ('CREATE_PROJECT', 'Allows creation of projects'),
  ('EDIT_PROJECT', 'Allows editing a project'),
  ('DELETE_PROJECT', 'Allows deleting a project'),
  ('VIEW_PROJECTS', 'Allows viewing projects'),
  ('CREATE_FEATURE_TOGGLE', 'Allows creating a feature toggle for a project'),
  ('EDIT_FEATURE_TOGGLE', 'Allows editing a feature toggle for a project'),
  ('DELETE_FEATURE_TOGGLE', 'Allows deleting a feature toggle for a project'),
  ('VIEW_FEATURE_TOGGLES', 'Allows viewing the features toggles of a project'),
  ('CREATE_ENVIRONMENT', 'Allows creating an environment for a project'),
  ('EDIT_ENVIRONMENT', 'Allows editing an environment for a project'),
  ('DELETE_ENVIRONMENT', 'Allows deleting an environment from a project'),
  ('VIEW_ENVIRONMENTS', 'Allows viewing environments of a project'),
  ('CREATE_PROJECT_API_TOKEN', 'Allows creating project API tokens'),
  ('VIEW_PROJECT_API_TOKENS', 'Allows viewing project API tokens'),
  ('DELETE_PROJECT_API_TOKEN', 'Allows deleting project API tokens');
--> statement-breakpoint

-- Create user roles --
INSERT INTO "roles"
	("name", "description")
VALUES
	('ADMIN', 'Administrative role, has all permissions by default'),
	('EDITOR', 'Role for users who will be creating and managing projects'),
	('VIEWER', 'Role that only allows viewing');
--> statement-breakpoint

-- Add permissions to ADMIN role --
WITH
	adminRoleId             AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	createUserId            AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_USER'),
  changeUsersApprovalId   AS (SELECT id FROM "permissions" WHERE "name" = 'CHANGE_USERS_APPROVAL'),
	addRoleId               AS (SELECT id FROM "permissions" WHERE "name" = 'ADD_ROLE_TO_USER'),
	removeRoleId            AS (SELECT id FROM "permissions" WHERE "name" = 'REMOVE_ROLE_FROM_USER'),
	viewUserId              AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_USERS'),
	addPermId               AS (SELECT id FROM "permissions" WHERE "name" = 'ADD_PERMISSION_TO_ROLE'),
	removePermId            AS (SELECT id FROM "permissions" WHERE "name" = 'REMOVE_PERMISSON_FROM_ROLE'),
	createProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT'),
	editProjectId           AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_PROJECT'),
	deleteProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT'),
	viewProjectsId          AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECTS'),
	createFeatureToggleId   AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_FEATURE_TOGGLE'),
	editFeatureToggleId     AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_FEATURE_TOGGLE'),
	deleteFeatureToggleId   AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_FEATURE_TOGGLE'),
	viewFeatureToggleId     AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_FEATURE_TOGGLES'),
	createProjectEnvId      AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_ENVIRONMENT'),
	editProjectEnvId        AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_ENVIRONMENT'),
	deleteProjectEnvId      AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_ENVIRONMENT'),
	viewEnvironmentsId      AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_ENVIRONMENTS'),
	createProjectApiTokenId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_API_TOKEN'),
	viewProjectApiTokensId  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_API_TOKENS'),
	deleteProjectApiTokenId AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_API_TOKEN')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM adminRoleId), (SELECT id FROM createUserId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM changeUsersApprovalId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM addRoleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM removeRoleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM viewUserId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM addPermId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM removePermId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM createProjectId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM editProjectId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM deleteProjectId)),
  ((SELECT id FROM adminRoleId), (SELECT id FROM viewProjectsId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM createFeatureToggleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM editFeatureToggleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM deleteFeatureToggleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM viewFeatureToggleId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM createProjectEnvId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM editProjectEnvId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM deleteProjectEnvId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM viewEnvironmentsId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM createProjectApiTokenId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM viewProjectApiTokensId)),
	((SELECT id FROM adminRoleId), (SELECT id FROM deleteProjectApiTokenId));
--> statement-breakpoint

-- Add permissions to EDITOR role --
WITH
	editorRoleId            AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
	createProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT'),
	editProjectId           AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_PROJECT'),
	deleteProjectId         AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT'),
	viewProjectsId          AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECTS'),
	createFeatureToggleId   AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_FEATURE_TOGGLE'),
	editFeatureToggleId     AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_FEATURE_TOGGLE'),
	deleteFeatureToggleId   AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_FEATURE_TOGGLE'),
	viewFeatureToggleId     AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_FEATURE_TOGGLES'),
	createProjectEnvId      AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_ENVIRONMENT'),
	editProjectEnvId        AS (SELECT id FROM "permissions" WHERE "name" = 'EDIT_ENVIRONMENT'),
	deleteProjectEnvId      AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_ENVIRONMENT'),
	viewEnvironmentsId      AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_ENVIRONMENTS'),
	createProjectApiTokenId AS (SELECT id FROM "permissions" WHERE "name" = 'CREATE_PROJECT_API_TOKEN'),
	viewProjectApiTokensId  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_API_TOKENS'),
	deleteProjectApiTokenId AS (SELECT id FROM "permissions" WHERE "name" = 'DELETE_PROJECT_API_TOKEN')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
	((SELECT id FROM editorRoleId), (SELECT id FROM createProjectId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM editProjectId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM deleteProjectId)),
  ((SELECT id FROM editorRoleId), (SELECT id FROM viewProjectsId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM createFeatureToggleId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM editFeatureToggleId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM deleteFeatureToggleId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM viewFeatureToggleId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM createProjectEnvId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM editProjectEnvId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM deleteProjectEnvId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM viewEnvironmentsId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM createProjectApiTokenId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM viewProjectApiTokensId)),
	((SELECT id FROM editorRoleId), (SELECT id FROM deleteProjectApiTokenId));
--> statement-breakpoint

-- Add permissions to viewer role
WITH
	viewerRoleId            AS (SELECT id FROM "roles" WHERE "name" = 'VIEWER'),
	viewProjectsId          AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECTS'),
	viewFeatureTogglesId    AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_FEATURE_TOGGLES'),
	viewEnvironmentsId      AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_ENVIRONMENTS'),
	viewProjectApiTokensId  AS (SELECT id FROM "permissions" WHERE "name" = 'VIEW_PROJECT_API_TOKENS')
INSERT INTO "roles_permissions"
	("role_id", "permission_id")
VALUES
  ((SELECT id FROM viewerRoleId), (SELECT id FROM viewProjectsId)),
	((SELECT id FROM viewerRoleId), (SELECT id FROM viewFeatureTogglesId)),
	((SELECT id FROM viewerRoleId), (SELECT id FROM viewEnvironmentsId)),
	((SELECT id FROM viewerRoleId), (SELECT id FROM viewProjectApiTokensId));
--> statement-breakpoint

-- Give Admin user ADMIN, EDITOR, VIEWER roles --
WITH
	adminUserId  AS (SELECT id FROM "users" WHERE "username" = 'Admin'),
	adminRoleId  AS (SELECT id FROM "roles" WHERE "name" = 'ADMIN'),
	editorRoleId AS (SELECT id FROM "roles" WHERE "name" = 'EDITOR'),
  viewerRoleId AS (SELECT id FROM "roles" WHERE "name" = 'VIEWER')
INSERT INTO "users_roles"
	("user_id", "role_id")
VALUES
	((SELECT id FROM adminUserId), (SELECT id FROM adminRoleId)),
	((SELECT id FROM adminUserId), (SELECT id FROM editorRoleId)),
	((SELECT id FROM adminUserId), (SELECT id FROM viewerRoleId));
