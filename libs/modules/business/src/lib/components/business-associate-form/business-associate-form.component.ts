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

// Location
import { Location } from '@angular/common';

@Component({
  selector: 'neural-business-associate-form',
  templateUrl: './business-associate-form.component.html',
  styleUrls: ['./business-associate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessAssociateFormComponent implements OnChanges {
  @Input() business: IBusinesses.IDocument;

  @Input() pagination: IBusinesses.IPagination;
  
  @Input() loading: boolean;

  @Input() accounts: IAccount.IDocument[];

  @Input() permissions: any;

  @Output()
  update: EventEmitter<IBusinesses.IUpdate> = new EventEmitter<
    IBusinesses.IUpdate
  >();

  @Output()
  changed: EventEmitter<IBusinesses.IConfig> = new EventEmitter<
    IBusinesses.IConfig
  >();

  form = this.fb.group({
    uuid: ['', Validators.compose([Validators.required])],
    accountUuids: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.business && changes.business.currentValue) {
      this.uuid.patchValue(this.business.uuid);
    }
  }

  get uuid() {
    return this.form.get('uuid') as FormControl;
  }

  get accountUuids() {
    return this.form.get('accountUuids') as FormControl;
  }

  selectAccount(accountUuid: string) {
    if (!this.form.disabled) {
      if (this.existsInAccounts(accountUuid)) {
        this.accountUuids.setValue(
          this.accountUuids.value.filter(val => val !== accountUuid)
        );
      } else {
        this.accountUuids.patchValue([...this.accountUuids.value, accountUuid]);
      }
    }

    return false;
  }

  existsInAccounts(accountUuid: string) {
    return this.accountUuids.value
      ? this.accountUuids.value.some(val => val === accountUuid)
      : false;
  }

  onCreate(form: FormGroup) {
    const { value, valid } = form;

    if (valid) {
      this.update.emit(value);

      this.form.disable();
    }
  }

  changePage() {
    if (this.pagination && this.pagination.page < this.pagination.pages) {
      const params: IBusinesses.IConfig = {
        limit: this.pagination.limit,
        page: this.pagination.page + 1
      };
      this.changed.emit(params);
    }
  }

  cancel() {
    this.location.back();
  }
}
