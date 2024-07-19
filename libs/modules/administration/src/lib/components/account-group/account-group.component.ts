import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  forwardRef,
  SimpleChanges
} from '@angular/core';

// Models
import { IGroup } from '../../models';

// Angular forms
import { FormControl, FormGroup } from '@angular/forms';

// RxJs
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

// Auto Complete events
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const GROUP_TAGS_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AccountGroupComponent),
  multi: true
};

@Component({
  selector: 'neural-account-group',
  templateUrl: './account-group.component.html',
  styleUrls: ['./account-group.component.scss'],
  providers: [GROUP_TAGS_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountGroupComponent implements ControlValueAccessor, OnChanges {
  @Input() group: IGroup.IDocument;
  @Input() groups: IGroup.IDocument[];
  @Input() isSuperAdmin: boolean;
  @Input() formDisabled: boolean;

  myControl = new FormControl('');
  filteredGroup: Observable<IGroup.IDocument[]>;
  value: string;

  onModelChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouch = fn;
  }

  writeValue(value: string) {
    this.value = value;
  }

  selectGroup(event: MatAutocompleteSelectedEvent) {
    if (!this.formDisabled) {
      this.value = event.option.value.uuid;

      this.onTouch();
      this.onModelChange(this.value);
    }

    return false;
  }

  displayFn(group?: IGroup.IDocument): string | undefined {
    return group ? group.name : undefined;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredGroup = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: IGroup.IDocument | any) =>
        this._filter(value ? value.name : '')
      )
    );

    if (changes.group && changes.group.currentValue) {
      this.myControl.patchValue(this.group);
    }

    if (changes.formDisabled && changes.formDisabled.currentValue) {
      this.myControl.disable();
    }
  }

  private _filter(value: IGroup.IDocument): IGroup.IDocument[] {
    const filterValue = value ? value.name : '';

    let groups = this.groups;

    const SuperAdmin = 'SuperAdmin';

    if (!this.isSuperAdmin) {
      groups = groups.reduce((acc, curr) => {
        if (curr.name !== SuperAdmin) acc.push(curr);
        return acc;
      }, []);
    }

    return groups.filter(group => group.name.includes(filterValue));
  }

  constructor() {}
}
