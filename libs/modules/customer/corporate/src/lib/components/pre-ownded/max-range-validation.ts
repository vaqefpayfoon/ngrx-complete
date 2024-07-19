import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MaxRangeValidators {
  static MatchValidator(active: string, maxRange: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const activeCtrl = control.get(active);
      const maxRangeCtrl = control.get(maxRange);

      return (activeCtrl.value && !maxRangeCtrl.value)
        ? { mismatch: true }
        : null;
    };
  }
}