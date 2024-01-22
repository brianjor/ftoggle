/** Requirements for a project name */
export const projectNameReqs = {
  maxLength: 50,
  minLength: 3,
  transforms(name: string): string {
    return name.trim();
  },
};

/** Requirements for a project id */
export const projectIdReqs = {
  maxLength: 50,
  minLength: 3,
  pattern: '^[a-zA-Z0-9_%-]*$',
  transforms(id: string): string {
    return id.trim();
  },
};
