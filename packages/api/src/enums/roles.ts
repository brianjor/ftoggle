export enum ERoles {
  /** Administrative role, has all permissions by default */
  ADMIN = 'ADMIN',
  /** Role for users who will be creating and managing feature toggles */
  EDITOR = 'EDITOR',
  /** Role that only allows viewing permissions of feature toggle statuses */
  VIEWER = 'VIEWER',
}
