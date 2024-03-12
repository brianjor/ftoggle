import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const createNoExtraWhitespaceValidator = (
  settings: {
    /** Don't allow leading whitespace */
    noLeading?: boolean;
    /** Don't allow trailing whitespace */
    noTrailing?: boolean;
    /** Don't allow blank */
    noBlank?: boolean;
    /** Don't allow any whitespace */
    noAny?: boolean;
  } = {
    noLeading: false,
    noTrailing: false,
    noBlank: false,
    noAny: false,
  },
): ValidatorFn => {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasLeading = /^\s/.test(value);
    const hasTrailing = /\s$/.test(value);
    const isBlank = /^\s+$/.test(value);
    const hasAny = /\s/.test(value);

    const isValid =
      !(settings.noLeading && hasLeading) &&
      !(settings.noTrailing && hasTrailing) &&
      !(settings.noBlank && isBlank) &&
      !(settings.noAny && hasAny);
    return !isValid
      ? { hasExtraWhitespace: { hasLeading, hasTrailing, isBlank, hasAny } }
      : null;
  };
};
