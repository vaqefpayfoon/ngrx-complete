import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Models
import { IBusinesses } from '../../models';
import { IAccount } from '@neural/modules/administration';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

@Component({
  selector: 'neural-accounts-search',
  templateUrl: './accounts-search.component.html',
  styleUrls: ['./accounts-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsSearchComponent implements OnChanges {
  @Input() business: IBusinesses.IDocument;

  @Input() permissions: any;
  
  @Input()
  error: any;

  exists: boolean;

  @Output()
  search: EventEmitter<IBusinesses.ISearch[]> = new EventEmitter<
    IBusinesses.ISearch[]
  >();

  @Output()
  update: EventEmitter<IBusinesses.IUpdate> = new EventEmitter<
    IBusinesses.IUpdate
  >();

  @Output()
  loaded: EventEmitter<IBusinesses.IDocument> = new EventEmitter<
    IBusinesses.IDocument
  >();

  @Output() branchChange = new EventEmitter();

  searchForm = this.fb.group({
    phone: this.fb.group({
      code: [''],
      number: ['']
    }),
    name: this.fb.group({
      first: [''],
      last: ['']
    }),
    email: ['', Validators.compose([Validators.email])]
  });

  form = this.fb.group({
    uuid: ['', Validators.compose([Validators.required])],
    accountUuids: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.business && changes.business.currentValue) {
      this.exists = true;
      this.loaded.emit(this.business);
      this.form.patchValue(this.business);
      this.form.disable();
    }
  }

  onSearch(form: FormGroup) {
    const { value, valid } = form;
    if (valid) {
      const params: IBusinesses.ISearch[] = [];
      Object.keys(value).map(x => {
        if (!!value[x]) {
          if (x === 'email') {
            return params.push({ [`filter[${x}]`]: value[x] });
          }
          if (x === 'name') {
            Object.keys(value[x]).map(c => {
              if (!!value[x][c]) {
                return params.push({ [`filter[name.${c}]`]: value[x][c] });
              }
            });
          }
          if (x === 'phone') {
            Object.keys(value[x]).map(c => {
              if (!!value[x][c]) {
                return params.push({ [`filter[phone.${c}]`]: value[x][c] });
              }
            });
          }
        }
      });

      if (!!params.length) {
        this.search.emit(params);
      }
    }
  }
  get name() {
    return this.searchForm.get('name') as FormGroup;
  }
  get first() {
    return this.name.get('first') as FormControl;
  }
  get last() {
    return this.name.get('last') as FormControl;
  }
  get email() {
    return this.searchForm.get('email') as FormControl;
  }
  get phone() {
    return this.searchForm.get('phone') as FormGroup;
  }
  get code() {
    return this.phone.get('code') as FormControl;
  }
  get number() {
    return this.phone.get('number') as FormControl;
  }

  get searchFormDisabled() {
    return !!this.first.value ||
      !!this.last.value ||
      !!this.email.value ||
      !!this.code.value ||
      !!this.number.value
      ? true
      : false;
  }
}
