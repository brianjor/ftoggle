import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const isDateValidator = (
  control: AbstractControl<string | Date>,
): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  let isDate = false;
  if (value instanceof Date) {
    isDate = true;
  } else {
    isDate = DateTime.fromISO(value).isValid;
  }

  return !isDate ? { invalidDate: true } : null;
};
