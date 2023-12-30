export enum ERoles {
  /** Administrative role, has all permissions by default */
  ADMIN = 'ADMIN',
  /** Role for users who will be creating and managing feature toggles */
  EDITOR = 'EDITOR',
  /** Role that only allows viewing permissions of feature toggle statuses */
  VIEWER = 'VIEWER',
}

/** Project level roles. */
export enum ProjectRole {
  /** Owner of the project. Has all permissions. */
  OWNER = 'PROJECT_OWNER',
  /** Project member. Has read/create/modify/delete permissions for feature toggles and environments. */
  MEMBER = 'PROJECT_MEMBER',
  /** Only allowed to view the project. */
  VIEWER = 'PROJECT_VIEWER',
}
