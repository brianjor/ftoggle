import { urlSafePattern } from './common';

export const contextFieldNameReqs = {
  maxLength: 50,
  minLength: 3,
  pattern: urlSafePattern,
  transforms(name: string): string {
    return name.trim();
  },
};

export const contextFieldDescriptionReqs = {
  maxLength: 255,
  minLength: 3,
  transforms(description?: string): string | undefined {
    return description?.trim();
  },
};
