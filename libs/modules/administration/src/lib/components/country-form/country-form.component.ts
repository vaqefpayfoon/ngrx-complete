import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ICountry } from '../../models';

// Angular Form Builder
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// Location
import { Location } from '@angular/common';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-country-form',
  templateUrl: './country-form.component.html',
  styleUrls: ['./country-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryFormComponent implements OnChanges {
  exists = false;

  @Input() allCountries: string[];

  @Input() currencies: string[];

  @Input() error: any;

  @Input() loading: any;

  @Input() country: ICountry.IDocument;

  @Input() selectedCountry: ICountry.IGetCountry;

  @Input() permissions: any;

  @Output() countryChange = new EventEmitter<string>();

  @Output() loaded = new EventEmitter<ICountry.IDocument>();

  @Output()
  create: EventEmitter<ICountry.ICreate> = new EventEmitter<ICountry.ICreate>();

  @Output()
  update: EventEmitter<ICountry.IUpdate> = new EventEmitter<ICountry.IUpdate>();

  isSelect: boolean;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  countryCtrl = new FormControl();
  filteredCountries: Observable<string[]>;
  countries: string;

  @ViewChild('countryInput') countryInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  form: FormGroup;

  constructor(private fb: FormBuilder, private location: Location) {
    this.initialForm();
  }

  initialForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      states: ['', Validators.required],
      currencies: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allCountries && changes.allCountries.currentValue) {
      this.filteredCountries = this.countryCtrl.valueChanges.pipe(
        startWith(''),
        map((country: string | null) => {
          return country ? this._filter(country) : this.allCountries.slice();
        })
      );
    }

    if (
      this.country &&
      this.country.uuid &&
      changes.country &&
      changes.country.currentValue
    ) {
      this.loaded.emit(this.country);

      this.countries = this.country.name;
      this.form.get('name').setValue(this.countries);
      // enable form
      this.exists = true;
      this.isSelect = true;

      // Select currencies
      const currencies: string[] = this.country.codes.currencies.map(
        currency => currency.code
      );
      this.form.get('currencies').setValue(currencies);

      const states: string[] = this.country.states.map(state => state.name);
      this.form.get('states').setValue(states);

      this.form.disable();
    }

    if (
      this.country &&
      this.country.uuid &&
      changes.country &&
      changes.country.currentValue
    ) {
      this.countries = this.country.name;
      this.form.get('name').setValue(this.countries);
      // enable form
      this.exists = true;
      this.isSelect = true;

      // Select currencies
      const currencies: string[] = this.country.codes.currencies.map(
        currency => currency.code
      );
      this.form.get('currencies').setValue(currencies);

      const states: string[] = this.country.states.map(state => state.name);
      this.form.get('states').setValue(states);

      this.form.disable();
    }

    if (changes && changes.error && !changes.error.firstChange) {
      this.form.enable();
    }
  }

  add(event: MatChipInputEvent): void {
    // Add country only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our country
      if ((value || '').trim()) {
        this.countries = value.trim();
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.countryCtrl.setValue(null);
    }
  }

  remove() {
    this.countries = ''.trim();
    this.isSelect = false;
    this.form.reset();
    this.initialForm();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.countryChange.emit(event.option.viewValue);
    this.countries = event.option.viewValue;
    this.form.get('name').setValue(this.countries);
    this.countryInput.nativeElement.value = '';
    this.countryCtrl.setValue(null);
    this.isSelect = true;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCountries.filter(
      country => country.toLowerCase().indexOf(filterValue) === 0
    );
  }

  get states() {
    return this.selectedCountry && this.selectedCountry.states
      ? this.selectedCountry.states
      : null;
  }

  get name() {
    return this.form.get('name');
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get valid() {
    return this.form.valid;
  }

  get touched() {
    return this.form.touched;
  }

  updateCountry(form: FormGroup) {
    const { valid, value, touched } = form;

    if (valid && touched && this.updatePermission) {
      this.update.emit({
        uuid: this.country.uuid,
        ...value
      });
      this.form.disable();
    }
  }

  enable() {
    this.form.enable();
    this.form.get('name').disable();
  }

  createCountry(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
      this.form.disable();
    }
  }

  cancel() {
    if (this.exists) {
      this.countries = this.country.name;
      this.form.get('name').setValue(this.countries);
      // enable form
      this.exists = true;
      this.isSelect = true;

      // Select currencies
      const currencies: string[] = this.country.codes.currencies.map(
        currency => currency.code
      );
      this.form.get('currencies').setValue(currencies);

      const states: string[] = this.country.states.map(state => state.name);
      this.form.get('states').setValue(states);

      this.form.disable();
    } else {
      this.location.back();
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Country.CREATE_COUNTRY]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Country.UPDATE_COUNTRY]
    ) {
      return true;
    }
    return false;
  }
}
