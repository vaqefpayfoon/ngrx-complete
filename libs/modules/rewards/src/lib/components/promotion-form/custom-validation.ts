import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AlphaNumericalValidators {
  static MatchValidator(value: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const codeCtrl = control.get(value);
      const reg = new RegExp(/^[a-zA-Z0-9_]*$/);
      return !reg.exec(codeCtrl.value) || (codeCtrl.value.length < 3) || (codeCtrl.value.length > 12)
        ? { mismatch: true }
        : null;
    };
  }
}


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
