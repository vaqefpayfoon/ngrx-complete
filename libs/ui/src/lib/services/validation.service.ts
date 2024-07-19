import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      minlength: `Password must be at least  ${validatorValue.requiredLength} characters.`,
      maxlength: `Password must be max ${validatorValue.requiredLength} characters.`,
      max: `Number must be maximum ${validatorValue.max}`,
      min: `Number must be minimum ${validatorValue.min}`,
      required: 'This field is required',
      email: 'The ' + validatorName + ' must contain a valid email address',
      invalidPassword:
      'Enter at least 8 alphanumeric characters with a combination of uppercase, lowercase and number.',
      invalidPhone: 'The mobile phone in invalid',
      invalidMatch: 'The password and confirm password must match',
      invalidPrice: 'Down Payment should not be more than 50% of Vehicle Price',
      greaterThanZero: 'The amount must be greater than zero',
      alphanumeric: 'Enter a combination of at least 1 number and letters.',
    };
    return config[validatorName];
  }

  static alphanumeric(control: FormControl) {
    if (!control.value) {
      return null;
    }

    if (control.value && control.value.match(/.*[a-zA-Z0-9]$/)) {
      return null;
    } else {
      return { alphanumeric: true };
    }
  }

  static password(control: FormControl) {
    if (
      control.value &&
      control.value.match(
        /^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])))(?=.{8,})/
      )
    ) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  static phone(control: FormControl) {
    if (control.value && control.value.match(/^[+]*[60][0-9]?\d{10}$/)) {
      return null;
    } else {
      return { invalidPhone: true };
    }
  }

  static greaterThanZero(control: FormControl) {
    const { value } = control;

    if (
      !!value &&
      value
        .toString()
        .match(/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/)
    ) {
      return null;
    } else {
      return { greaterThanZero: true };
    }
  }

  static match(controlName: string, matchingControlName: string) {
    const validator = (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.invalidMatch) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ invalidMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
    return validator;
  }

  static halfPrice(price: number): ValidatorFn {
    return (currentControl: AbstractControl): { [key: string]: any } => {
      if (currentControl.value > percentage(price, 50)) {
        return { invalidPrice: true };
      }
    };
  }

  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        const { controls } = control;
        Object.keys(controls).forEach((groupField) => {
          const groupControl = control.get(groupField);
          if (groupControl instanceof FormControl) {
            groupControl.markAsTouched();
          } else if (groupControl instanceof FormGroup) {
            this.validateAllFormFields(groupControl);
          }
        });
      }
    });
  }
}

function percentage(num: number, per: number) {
  return (num / 100) * per;
}
