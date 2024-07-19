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

// Angular Form Builder
import {
  FormControl,
  FormGroup
} from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Models
import { ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-corporate-app-identifire',
  templateUrl: './corporate-app-identifire.component.html',
  styleUrls: ['./corporate-app-identifire.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateAppIdentifireComponent implements OnChanges {
  @Input() parent: FormGroup;

  @Input() corporate: ICorporates.IDocument;

  @Input() permissions: any;

  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();
  @Output() action = new EventEmitter<string>();

  visible = true;

  selectable = true;

  removable = true;

  addOnBlur = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  appIdentifireCtrl = new FormControl({
    value: '',
    disabled: false
  });

  filteredAppIdentifire: Observable<string[]>;

  appIdentifiers: string[] = [];

  @ViewChild('appIFInput') appIFInput: ElementRef<
    HTMLInputElement
  >;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredAppIdentifire = this.appIdentifireCtrl.valueChanges.pipe(
      startWith(''),
      map((appIdentifire: string | null) =>
        appIdentifire
          ? this._filter(appIdentifire)
          : this.appIdentifiers.slice()
      )
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.corporate && changes.corporate.currentValue) {
      if (this.appIdentifiersControl.valid) {
        this.appIdentifiersControl.value.map((x: any) =>
          this.appIdentifiers.push(x)
        );
      }
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
        const index = this.appIdentifiersControl.value.indexOf(value.trim());

        if (index === -1) {
          this.appIdentifiersControl.patchValue([
            ...this.appIdentifiersControl.value,
            value.trim()
          ]);
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.appIdentifireCtrl.setValue(null);
    }
  }

  remove(appIdentifire: string): void {
    const index = this.appIdentifiersControl.value.indexOf(appIdentifire);

    if (index >= 0) {
      const appIdentifiersControl = this.appIdentifiersControl.value.map(
        (x: any) => x
      );

      appIdentifiersControl.splice(index, 1);

      this.appIdentifiersControl.patchValue(appIdentifiersControl);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.appIdentifiers.indexOf(event.option.viewValue);

    if (index === -1) {
      this.appIdentifiers.push(event.option.viewValue);
    }

    const i = this.appIdentifiersControl.value.indexOf(event.option.viewValue);

    if (i === -1) {
      this.appIdentifiersControl.patchValue([
        ...this.appIdentifiersControl.value,
        event.option.viewValue
      ]);
    }

    this.appIFInput.nativeElement.value = '';
    this.appIdentifireCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.appIdentifiers.filter(
      appIdentifire => appIdentifire.toLowerCase().indexOf(filterValue) === 0
    );
  }

  get appIdentifiersControl() {
    return this.parent.get('appIdentifiers') as FormControl;
  }

  selectedValue(name: string) {
    return this.appIdentifiersControl.value.includes(name);
  }

  onAction(action: string) {
    this.action.emit(action);
  }

  onSave(form: FormGroup) {
    // Check it've saved
    if (this.corporate && this.corporate.uuid) {
      // create new people In Charges
      if (form.valid) {
        this.updated.emit(form.valid);
      }
    } else {
      // Update new people In Charges
      if (form.valid) {
        this.created.emit(form.valid);
      }
    }
  }

  get formDisabled() {
    return this.parent.disabled;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.CREATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.UPDATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }
}
