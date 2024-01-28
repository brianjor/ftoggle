/** Requirements for an environment name */
export const environmentNameReqs = {
  maxLength: 50,
  minLength: 3,
  pattern: '^[a-zA-Z0-9_%-]*$',
  transforms(name: string): string {
    return name.trim();
  },
};
