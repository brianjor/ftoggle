import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const isDateValidator = (
  control: AbstractControl<string>,
): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  const possibleDate = DateTime.fromISO(value);

  return !possibleDate.isValid ? { invalidDate: true } : null;
};
