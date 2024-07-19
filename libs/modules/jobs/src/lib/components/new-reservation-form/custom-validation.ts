import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DecimalValidators {
  static MatchValidator(value: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valueCtrl = control.get(value);

      return !Number.isInteger(valueCtrl.value) && (valueCtrl.value != null)
        ? { mismatch: true }
        : null;
    };
  }
}
