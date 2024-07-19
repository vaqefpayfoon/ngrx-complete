import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Models
import { Auth } from '@neural/auth';

// Angular Form Builder
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup
} from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

// Location
import { Location } from '@angular/common';

@Component({
  selector: 'neural-account-corporate',
  templateUrl: './account-corporate.component.html',
  styleUrls: ['./account-corporate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountCorporateComponent implements OnChanges {
  exists = false;

  @Input() allCorporate: Auth.ICorporates[];
  @Input() error: any;
  @Input() loading: any;
  @Input() corporate: Auth.ICorporates;
  @Input() selectedCorporate: Auth.ICorporates[];
  @Output() corporateChange = new EventEmitter<Auth.ICorporates>();

  isSelect: boolean;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  corporateCtrl = new FormControl();
  filteredCorporate: Observable<Auth.ICorporates[]>;
  corporates: string[] = [];

  @ViewChild('corporateInput') corporateInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allCorporate && changes.allCorporate.currentValue) {
      this.filteredCorporate = this.corporateCtrl.valueChanges.pipe(
        startWith(''),
        map((corporate: Auth.ICorporates | null) => {
          return corporate
            ? this._filter(corporate.uuid)
            : this.allCorporate.slice();
        })
      );
    }

    if (
      changes &&
      changes.selectedCorporate &&
      changes.selectedCorporate.currentValue
    ) {

      const [{uuid}] = this.selectedCorporate;

      const index = this.allCorporate.findIndex(
        x => x.uuid === uuid
      );
 
      if (index !== -1) {
        this.corporateChange.emit(this.allCorporate[index]);
        this.corporates.push(this.allCorporate[index].name);
      }
    }
    if (changes && changes.error && !changes.error.firstChange) {
      this.form.enable();
    }
  }

  initialForm() {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  add(event: MatChipInputEvent): void {
    // Add country only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our corporates
      if ((value || '').trim()) {
        this.corporates.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.corporateCtrl.setValue(null);
    }
  }

  remove(corporate: string): void {
    const index = this.corporates.indexOf(corporate);

    if (index >= 0) {
      this.corporates.splice(index, 1);
    }

    this.corporateChange.emit(null);

    this.isSelect = false;
    this.form.reset();
    this.initialForm();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.corporateChange.emit(event.option.value);
    this.corporates.push(event.option.viewValue);
    this.form.get('name').setValue(this.corporates);
    this.corporateInput.nativeElement.value = '';
    this.corporateCtrl.setValue(null);
  }

  private _filter(value: string): Auth.ICorporates[] {
    const filterValue = value;
    return this.allCorporate.filter(
      corporate => corporate.uuid.indexOf(filterValue) === 0
    );
  }

  displayFn(corporate?: Auth.ICorporates): string | undefined {
    return corporate ? corporate.name : undefined;
  }
}
