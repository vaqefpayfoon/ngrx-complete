import { Component, Input } from '@angular/core';

import { AbstractControl, FormControl } from '@angular/forms';

import { ValidationService } from '../../services';

@Component({
  selector: 'neural-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss']
})
export class ShowErrorsComponent {
  @Input() control: AbstractControl | FormControl;

  constructor() {}

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.control.dirty)
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    } return null;
  }
}
