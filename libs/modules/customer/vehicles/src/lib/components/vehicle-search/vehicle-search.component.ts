import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

// Angular Form Builder
import {
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'neural-vehicle-search',
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSearchComponent {

  @Output() searchedByNumberPlate = new EventEmitter<string>();

  numberPlate = new FormControl(
    '',
    Validators.compose([Validators.required])
  );

  constructor() {}

  onSearchVIN(form: FormControl) {
    const { value, valid } = form;
    if (valid) {
      this.searchedByNumberPlate.emit(value);
    }
  }

}
