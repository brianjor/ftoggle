export const conditionsFieldValuesReqs = {
  maxLength: 100,
};

export const conditionsFieldDescriptionReqs = {
  maxLength: 255,
  transforms(description?: string): string | undefined {
    return description?.trim();
  },
};
