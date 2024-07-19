import { FormGroup, Validators } from '@angular/forms';

export async function addRequiredValidation(form: FormGroup) {
  for (const field in form.controls) {
    const formItem = form.get(field);

    if (Object.hasOwnProperty.call(formItem, 'controls')) {
      addRequiredValidation(formItem as FormGroup);
    }

    formItem.setValidators([Validators.required]);
    formItem.updateValueAndValidity();
  }
}

export async function removeRequiredValidation(form: FormGroup) {
  for (const field in form.controls) {
    const formItem = form.get(field);

    if (Object.hasOwnProperty.call(formItem, 'controls')) {
      removeRequiredValidation(formItem as FormGroup);
    }

    formItem.clearValidators();
    formItem.updateValueAndValidity();
  }
}
