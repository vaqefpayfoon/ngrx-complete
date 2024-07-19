import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Angular Form Builder
import { FormControl, FormGroup } from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Auto Complete events
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

// Models
import { IVehicleReference } from '../../models';

@Component({
  selector: 'neural-vehicle-coverage-servicemap',
  templateUrl: './vehicle-coverage-servicemap.component.html',
  styleUrls: ['./vehicle-coverage-servicemap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCoverageServicemapComponent implements OnChanges {
  private _activeServiceMap = false;
  get activeServiceMap(): boolean {
    return this._activeServiceMap;
  }
  set activeServiceMap(value: boolean) {
    this._activeServiceMap = value;
  }

  @Input() parent: FormGroup;

  @Input() vehicle: IVehicleReference.IDocument;

  @Input() permissionValid: boolean;

  @Input() formDisabled: boolean;

  @Input() formValid: boolean;

  @Input() exists: boolean;

  @Output() created = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();
  @Output() action = new EventEmitter<boolean>();
  @Output() active = new EventEmitter<boolean>();

  visible = true;

  selectable = true;

  removable = true;

  addOnBlur = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  appIdentifireCtrl = new FormControl('');

  breakPadFrontAxileCtrl = new FormControl('');

  breakPadRearAxileCtrl = new FormControl('');

  tyreFrontAxileCtrl = new FormControl('');

  tyreRearAxileCtrl = new FormControl('');

  MinimumRequirement = new FormControl('');

  engineOilPartNumbersCtrl = new FormControl();

  filteredAppIdentifire: Observable<string[]>;

  filteredEngineOilPartNumbers: Observable<string[]>;

  filteredBreakPadFrontAxileCtrl: Observable<string[]>;
  filteredBreakPadRearAxileCtrl: Observable<string[]>;

  filteredTyreFrontAxileCtrl: Observable<string[]>;
  filteredTyreRearAxileCtrl: Observable<string[]>;

  appIdentifiers: string[] = [];
  engineOilPartNumbers: string[] = [];

  brakePadFearAxiles: string[] = [];
  brakePadRearAxiles: string[] = [];

  tyreFearAxiles: string[] = [];
  tyreRearAxiles: string[] = [];

  @ViewChild('appIFInput') appIFInput: ElementRef<HTMLInputElement>;

  @ViewChild('bpfaInput') bpfaInput: ElementRef<HTMLInputElement>;

  @ViewChild('bpraInput') bpraInput: ElementRef<HTMLInputElement>;

  @ViewChild('tyrefaInput') tyrefaInput: ElementRef<HTMLInputElement>;

  @ViewChild('tyreraInput') tyreraInput: ElementRef<HTMLInputElement>;

  @ViewChild('engineOilPartNumbersInput')
  engineOilPartNumbersInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild('bpfaauto')
  bpfaMatAutocomplete: MatAutocomplete;

  @ViewChild('bpraauto')
  bpraMatAutocomplete: MatAutocomplete;

  @ViewChild('tyrefaauto')
  tyrefaMatAutocomplete: MatAutocomplete;

  @ViewChild('tyreraauto')
  tyreraMatAutocomplete: MatAutocomplete;

  @ViewChild('engineOilPartNumbersMatAutocomplete')
  engineOilPartNumbersMatAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredAppIdentifire = this.appIdentifireCtrl.valueChanges.pipe(
      startWith(''),
      map((appIdentifire: string | null) =>
        appIdentifire
          ? this._filter(appIdentifire)
          : this.appIdentifiers.slice()
      )
    );

    this.filteredBreakPadFrontAxileCtrl = this.breakPadFrontAxileCtrl.valueChanges.pipe(
      startWith(''),
      map((breakPadFrontAxile: string | null) =>
        breakPadFrontAxile
          ? this._filterbpfa(breakPadFrontAxile)
          : this.brakePadFearAxiles.slice()
      )
    );

    this.filteredBreakPadRearAxileCtrl = this.breakPadRearAxileCtrl.valueChanges.pipe(
      startWith(''),
      map((breakPadRearAxile: string | null) =>
        breakPadRearAxile
          ? this._filterbprfa(breakPadRearAxile)
          : this.brakePadRearAxiles.slice()
      )
    );

    this.filteredTyreFrontAxileCtrl = this.tyreFrontAxileCtrl.valueChanges.pipe(
      startWith(''),
      map((tyreFrontAxile: string | null) =>
        tyreFrontAxile
          ? this._filtertyrefa(tyreFrontAxile)
          : this.tyreFearAxiles.slice()
      )
    );

    this.filteredTyreRearAxileCtrl = this.tyreRearAxileCtrl.valueChanges.pipe(
      startWith(''),
      map((breakPadRearAxile: string | null) =>
        breakPadRearAxile
          ? this._filtertyrerfa(breakPadRearAxile)
          : this.tyreRearAxiles.slice()
      )
    );

    this.filteredEngineOilPartNumbers = this.engineOilPartNumbersCtrl.valueChanges.pipe(
      startWith(''),
      map((engineOilPartNumber: string | null) =>
        engineOilPartNumber
          ? this._filterPartNumber(engineOilPartNumber)
          : this.engineOilPartNumbers.slice()
      )
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.vehicle && changes.vehicle.currentValue) {
      const { serviceMap } = this.vehicle;

      this.activeServiceMap = true;

      this.parent.disable();

      this.exists = true;

      this.appIdentifiers.push(...serviceMap.battery.partNumbers);
      this.engineOilPartNumbers.push(
        ...serviceMap.engineOil.partNumbers.filter
      );
      this.MinimumRequirement.patchValue(
        serviceMap.engineOil.MinimumRequirement
      );
      this.brakePadFearAxiles.push(
        ...serviceMap.brakePad.partNumbers.frontAxle
      );
      this.brakePadRearAxiles.push(...serviceMap.brakePad.partNumbers.rearAxle);
      this.tyreFearAxiles.push(...serviceMap.tyre.partNumbers.frontAxle);
      this.tyreRearAxiles.push(...serviceMap.tyre.partNumbers.rearAxle);
    }
  }

  add(event: MatChipInputEvent): void {
    // Add appIdentifire only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our appIdentifire
      if ((value || '').trim()) {
        this.appIdentifiers.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.appIdentifireCtrl.setValue(null);
    }
  }

  addbpfa(event: MatChipInputEvent): void {
    // Add appIdentifire only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.bpfaMatAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our appIdentifire
      if ((value || '').trim()) {
        this.brakePadFearAxiles.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.breakPadFrontAxileCtrl.setValue(null);
    }
  }

  addbpra(event: MatChipInputEvent): void {
    // Add appIdentifire only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.bpraMatAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our appIdentifire
      if ((value || '').trim()) {
        this.brakePadRearAxiles.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.breakPadRearAxileCtrl.setValue(null);
    }
  }

  addtyrefa(event: MatChipInputEvent): void {
    // Add appIdentifire only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.tyrefaMatAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our appIdentifire
      if ((value || '').trim()) {
        this.tyreFearAxiles.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tyreFrontAxileCtrl.setValue(null);
    }
  }

  addtyrera(event: MatChipInputEvent): void {
    // Add appIdentifire only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.tyreraMatAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our appIdentifire
      if ((value || '').trim()) {
        this.tyreRearAxiles.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tyreRearAxileCtrl.setValue(null);
    }
  }

  addEngineOilPartNumber(event: MatChipInputEvent): void {
    // Add appIdentifire only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.engineOilPartNumbersMatAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our appIdentifire
      if ((value || '').trim()) {
        this.engineOilPartNumbers.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.engineOilPartNumbersCtrl.setValue(null);
    }
  }

  remove(appIdentifire: string): void {
    const index = this.appIdentifiers.indexOf(appIdentifire);

    if (index >= 0) {
      this.appIdentifiers.splice(index, 1);
    }
  }

  removebpfa(bfa: string): void {
    const index = this.brakePadFearAxiles.indexOf(bfa);

    if (index >= 0) {
      this.brakePadFearAxiles.splice(index, 1);
    }
  }

  removebpra(rfa: string): void {
    const index = this.brakePadRearAxiles.indexOf(rfa);

    if (index >= 0) {
      this.brakePadRearAxiles.splice(index, 1);
    }
  }

  removetyrefa(bfa: string): void {
    const index = this.tyreFearAxiles.indexOf(bfa);

    if (index >= 0) {
      this.tyreFearAxiles.splice(index, 1);
    }
  }

  removetyrera(rfa: string): void {
    const index = this.tyreRearAxiles.indexOf(rfa);

    if (index >= 0) {
      this.tyreRearAxiles.splice(index, 1);
    }
  }

  removePartNumber(pnumber: string): void {
    const index = this.engineOilPartNumbers.indexOf(pnumber);

    if (index >= 0) {
      this.engineOilPartNumbers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.appIdentifiers.push(event.option.viewValue);
    this.appIFInput.nativeElement.value = '';
    this.appIdentifireCtrl.setValue(null);
  }

  selectedbpfa(event: MatAutocompleteSelectedEvent): void {
    this.brakePadFearAxiles.push(event.option.viewValue);
    this.bpfaInput.nativeElement.value = '';
    this.breakPadFrontAxileCtrl.setValue(null);
  }

  selectedbpra(event: MatAutocompleteSelectedEvent): void {
    this.brakePadRearAxiles.push(event.option.viewValue);
    this.bpraInput.nativeElement.value = '';
    this.breakPadRearAxileCtrl.setValue(null);
  }

  selectedtyrefa(event: MatAutocompleteSelectedEvent): void {
    this.tyreFearAxiles.push(event.option.viewValue);
    this.tyrefaInput.nativeElement.value = '';
    this.tyreFrontAxileCtrl.setValue(null);
  }

  selectedtyrera(event: MatAutocompleteSelectedEvent): void {
    this.tyreRearAxiles.push(event.option.viewValue);
    this.tyreraInput.nativeElement.value = '';
    this.tyreRearAxileCtrl.setValue(null);
  }

  selectedPartNumber(event: MatAutocompleteSelectedEvent): void {
    this.engineOilPartNumbers.push(event.option.viewValue);
    this.engineOilPartNumbersInput.nativeElement.value = '';
    this.engineOilPartNumbersCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.appIdentifiers.filter(
      (appIdentifire) => appIdentifire.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterbpfa(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.brakePadFearAxiles.filter(
      (bfa) => bfa.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterbprfa(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.brakePadRearAxiles.filter(
      (rfa) => rfa.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filtertyrefa(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tyreFearAxiles.filter(
      (bfa) => bfa.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filtertyrerfa(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tyreRearAxiles.filter(
      (rfa) => rfa.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterPartNumber(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.engineOilPartNumbers.filter(
      (rfa) => rfa.toLowerCase().indexOf(filterValue) === 0
    );
  }

  get serviceMap() {
    return this.parent.get('serviceMap') as FormGroup;
  }

  onSave(form: FormGroup) {
    if (this.exists) {
      form.updateValueAndValidity();

      this.onUpdate(form);
    } else {
      form.updateValueAndValidity();

      if (this.formValid) {
        this.onCreate(form);
      }
    }
  }

  onCreate(form: FormGroup) {
    const { valid } = form;

    if (valid) {
      this.serviceMap.get('battery').patchValue({
        partNumbers: this.appIdentifiers,
      });

      this.serviceMap.get('brakePad').patchValue({
        partNumbers: {
          frontAxile: this.brakePadFearAxiles,
          rearAxile: this.brakePadRearAxiles,
        },
      });

      this.serviceMap.get('tyre').patchValue({
        partNumbers: {
          frontAxile: this.tyreFearAxiles,
          rearAxile: this.tyreRearAxiles,
        },
      });

      this.serviceMap.get('engineOil').patchValue({
        MinimumRequirement: this.MinimumRequirement.value,
        PartNumbers: {
          filter: this.engineOilPartNumbers,
        },
      });

      this.created.emit(form);
    }
  }

  onUpdate(form: FormGroup) {
    this.serviceMap.get('battery').patchValue({
      partNumbers: this.appIdentifiers,
    });

    this.serviceMap.get('brakePad').patchValue({
      partNumbers: {
        frontAxle: this.brakePadFearAxiles,
        rearAxle: this.brakePadRearAxiles,
      },
    });

    this.serviceMap.get('tyre').patchValue({
      partNumbers: {
        frontAxle: this.tyreFearAxiles,
        rearAxle: this.tyreRearAxiles,
      },
    });

    this.serviceMap.get('engineOil').patchValue({
      MinimumRequirement: this.MinimumRequirement.value,
      PartNumbers: {
        filter: this.engineOilPartNumbers,
      },
    });

    this.updated.emit(form);
  }

  cancel() {
    this.action.emit(true);
  }

  onChangeServiceMap(event: MatSlideToggleChange) {
    this.activeServiceMap = event.checked;

    event.checked ? this.serviceMap.enable() : this.serviceMap.disable();
  }
}
