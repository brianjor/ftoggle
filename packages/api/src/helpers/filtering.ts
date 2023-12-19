/**
 * Checks if a value is null or not. For use in filters to remove null values.
 * Uses type guarding to help typescript understand that we are removing nulls.
 * @param value some value that might be null
 * @returns True if value is not null, false otherwise
 */
export const notNull = <T>(value: T | null): value is T => {
  return value !== null;
};
