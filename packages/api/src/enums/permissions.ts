/** User level roles permissions. */
export enum UserPermission {
  /** Allows creation of users */
  CREATE_USER = 'CREATE_USER',
  /** Allows changing a users approval */
  CHANGE_USERS_APPROVAL = 'CHANGE_USERS_APPROVAL',
  /** Allows adding a role to a user */
  ADD_ROLE_TO_USER = 'ADD_ROLE_TO_USER',
  /** Allows removing a role from a user */
  REMOVE_ROLE_FROM_USER = 'REMOVE_ROLE_FROM_USER',
  /** Allows viewing other users */
  VIEW_USERS = 'VIEW_USERS',
  /** Allows adding a permission to a role */
  ADD_PERMISSION_TO_ROLE = 'ADD_PERMISSION_TO_ROLE',
  /** Allows removing a permission from a role */
  REMOVE_PERMISSON_FROM_ROLE = 'REMOVE_PERMISSON_FROM_ROLE',
  /** Allows creation of projects */
  CREATE_PROJECT = 'CREATE_PROJECT',
  /** Allows editing a project */
  EDIT_PROJECT = 'EDIT_PROJECT',
  /** Allows deleting a project */
  DELETE_PROJECT = 'DELETE_PROJECT',
  /** Allows viewing projects */
  VIEW_PROJECTS = 'VIEW_PROJECTS',
  /** Allows creating a feature toggle */
  CREATE_FEATURE_TOGGLE = 'CREATE_FEATURE_TOGGLE',
  /** Allows editing a feature toggle */
  EDIT_FEATURE_TOGGLE = 'EDIT_FEATURE_TOGGLE',
  /** Allows deleting a feature toggle */
  DELETE_FEATURE_TOGGLE = 'DELETE_FEATURE_TOGGLE',
  /** Allows viewing the features toggles */
  VIEW_FEATURE_TOGGLES = 'VIEW_FEATURE_TOGGLES',
  /** Allows creating an environment */
  CREATE_ENVIRONMENT = 'CREATE_ENVIRONMENT',
  /** Allows editing an environment */
  EDIT_ENVIRONMENT = 'EDIT_ENVIRONMENT',
  /** Allows deleting an environment */
  DELETE_ENVIRONMENT = 'DELETE_ENVIRONMENT',
  /** Allows viewing environments */
  VIEW_ENVIRONMENTS = 'VIEW_ENVIRONMENTS',
  /** Allows creating project API tokens */
  CREATE_PROJECT_API_TOKEN = 'CREATE_PROJECT_API_TOKEN',
  /** Allows viewing project API tokens */
  VIEW_PROJECT_API_TOKENS = 'VIEW_PROJECT_API_TOKENS',
  /** Allows deleting project API token */
  DELETE_PROJECT_API_TOKEN = 'DELETE_PROJECT_API_TOKEN',
  /** Allows create a context field on a project */
  CREATE_PROJECT_CONTEXT_FIELD = 'CREATE_PROJECT_CONTEXT_FIELD',
}
