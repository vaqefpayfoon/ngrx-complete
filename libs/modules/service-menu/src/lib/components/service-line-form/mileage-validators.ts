import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MileageValidators {
  static MatchValidator(from: string, to: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fromCtrl = control.get(from);
      const toCtrl = control.get(to);

      return (fromCtrl.value > toCtrl.value) ||
        (fromCtrl.value < 1 || toCtrl.value < 1)
        ? { mismatch: true }
        : null;
    };
  }
}
