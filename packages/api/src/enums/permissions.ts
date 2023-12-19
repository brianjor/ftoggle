/** Permissions that are available to assign to roles. */
export enum EPermissions {
  /** Allows creation of users */
  CREATE_USER = 'CREATE_USER',
  /** Allows adding a role to a user */
  ADD_ROLE_TO_USER = 'ADD_ROLE_TO_USER',
  /** Allows removing a role from a user */
  REMOVE_ROLE_FROM_USER = 'REMOVE_ROLE_FROM_USER',
  /** Allows viewing other users */
  VIEW_USERS = 'VIEW_USERS',
  /** Allows creating a feature toggle */
  CREATE_FEATURE_TOGGLE = 'CREATE_FEATURE_TOGGLE',
  /** Allows editing a feature toggle */
  EDIT_FEATURE_TOGGLE = 'EDIT_FEATURE_TOGGLE',
  /** Allows viewing a feature toggle */
  VIEW_FEATURE_TOGGLE = 'VIEW_FEATURE_TOGGLE',
  /** Allows adding a permission to a role */
  ADD_PERMISSION_TO_ROLE = 'ADD_PERMISSION_TO_ROLE',
  /** Allows removing a permission from a role */
  REMOVE_PERMISSON_FROM_ROLE = 'REMOVE_PERMISSON_FROM_ROLE',
}
