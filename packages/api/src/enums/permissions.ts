/** User level roles permissions. */
export enum UserPermission {
  /** Allows creation of users */
  CREATE_USER = 'CREATE_USER',
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
  /** Allows creating a project */
  CREATE_PROJECT = 'CREATE_PROJECT',
}

/** Project level roles permissions. */
export enum ProjectPermission {
  /** Allows editing a project. */
  EDIT_PROJECT = 'EDIT_PROJECT',
  /** Allows deleting a project. */
  DELETE_PROJECT = 'DELETE_PROJECT',
  /** Allows adding a user to a project. */
  ADD_USER = 'ADD_PROJECT_USER',
  /** Allows removing a user from a project. */
  REMOVE_USER = 'REMOVE_PROJECT_USER',
  /** Allows viewing the users of a project. */
  VIEW_USERS = 'VIEW_PROJECT_USERS',
  /** Allows creating a feature toggle for a project. */
  CREATE_FEATURE_TOGGLE = 'CREATE_PROJECT_FEATURE_TOGGLE',
  /** Allows editing a feature toggle for a project. */
  EDIT_FEATURE_TOGGLE = 'EDIT_PROJECT_FEATURE_TOGGLE',
  /** Allows deleting a feature toggle for a project. */
  DELETE_FEATURE_TOGGLE = 'DELETE_PROJECT_FEATURE_TOGGLE',
  /** Allows viewing the features toggles of a project. */
  VIEW_FEATURE_TOGGLES = 'VIEW_PROJECT_FEATURE_TOGGLES',
  /** Allows creating an environment for a project. */
  CREATE_ENVIRONMENT = 'CREATE_PROJECT_ENVIRONMENT',
  /** Allows editing an environment for a project. */
  EDIT_ENVIRONMENT = 'EDIT_PROJECT_ENVIRONMENT',
  /** Allows deleting an environment from a project. */
  DELETE_ENVIRONMENT = 'DELETE_PROJECT_ENVIRONMENT',
  /** Allows viewing environments of a project. */
  VIEW_ENVIRONMENTS = 'VIEW_PROJECT_ENVIRONMENTS',
  /** Allows creating project API tokens. */
  CREATE_API_TOKEN = 'CREATE_PROJECT_API_TOKEN',
  /** Allows viewing project API tokens. */
  VIEW_API_TOKENS = 'VIEW_PROJECT_API_TOKENS',
  /** Allows deleting project API tokens. */
  DELETE_API_TOKEN = 'DELETE_PROJECT_API_TOKEN',
}
