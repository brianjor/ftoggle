/** User level roles. */
export const UserRole = {
  /** Administrative role, has all permissions. Able to bypass some permissions checks */
  ADMIN: 'ADMIN',
  /** General role for users. Has all permission of VIEWER, plus can create projects */
  EDITOR: 'EDITOR',
  /** Role that only has viewing permissions */
  VIEWER: 'VIEWER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserRoleValues = Object.values(UserRole);

/** Project level roles. */
export enum ProjectRole {
  /** Owner of the project. Has all permissions. */
  OWNER = 'PROJECT_OWNER',
  /** Project member. Has read/create/modify/delete permissions for feature toggles and environments. */
  MEMBER = 'PROJECT_MEMBER',
  /** Only allowed to view the project. */
  VIEWER = 'PROJECT_VIEWER',
}
