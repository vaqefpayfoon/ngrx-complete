import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { IBranches } from '../../models';
import { IAccount } from '@neural/modules/administration';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Location } from '@angular/common';
import { OffDaysValidators } from '../../functions/schedule-validation';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, startWith } from 'rxjs/operators';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'neural-schedules-off-days',
  templateUrl: './schedules-off-days.component.html',
  styleUrls: ['./schedules-off-days.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SchedulesOffDaysComponent implements OnInit {
  @Output() typeEvent = new EventEmitter<string>();
  @Output() save = new EventEmitter<IBranches.IOffDaysPayload>();
  @Output() cancelEvent = new EventEmitter();
  @Input() branch: IBranches.IDocument;
  offDays: IBranches.IOffDaysItem;
  accounts: string[] = [];
  accountCtrl = new FormControl('', Validators.required);
  myAccounts: string[] = [];
  onModelChange: any = () => {};
  @ViewChild('accountInput') accountInput: ElementRef<HTMLInputElement>;
  @ViewChild('fElement', { static: false }) fElement: ElementRef<
    HTMLInputElement
  >;
  branchUuid: string;
  corporateUuid: string;
  onTouch: any = () => {};
  minDate: Date;
  minEndDate: Date;
  dateDeactive = false;
  accountsObject: IAccount.IDocument[];
  @Input() accounts$: Observable<IAccount.IDocument[]>;
  customeValidation = {
    validator: OffDaysValidators.MatchValidator(
      'startTime',
      'endTime',
      'onLeave'
    ),
  };
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredAccounts: Observable<string[]>;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.minDate = new Date();
    this.minEndDate = _moment(new Date()).add(1, 'd').toDate();
  }

  form: FormGroup = this.fb.group({
    uuid: [''],
    reason: ['', Validators.required],
    advisors: [''],
    dateAndTime: this.fb.group(
      {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        startTime: [''],
        endTime: [''],
        onLeave: [false],
      },
      this.customeValidation
    ),
  });

  get dateAndTime(): FormGroup {
    return <FormGroup>this.form.get('dateAndTime');
  }

  get startDate(): FormControl {
    return <FormControl>this.dateAndTime.get('startDate');
  }

  get endDate(): FormControl {
    return <FormControl>this.dateAndTime.get('endDate');
  }

  get startTime(): FormControl {
    return <FormControl>this.dateAndTime.get('startTime');
  }

  get endTime(): FormControl {
    return <FormControl>this.dateAndTime.get('endTime');
  }

  ngOnInit(): void {
    this.initialized();
  }

  initialized(): void {
    this.route.params.subscribe((res) => {
      this.branchUuid = res.uuid;
      this.corporateUuid = res.cUuid;
      if (res.offDaysUuid) {
        this.offDays = this.branch?.schedulesOffDays?.find(
          (x) => x.uuid == res.offDaysUuid
        );
        if (this.offDays) {
          this.form.patchValue({
            uuid: this.offDays.uuid,
            reason: this.offDays.reason,
            advisors: this.offDays.advisors.map((x) => x.uuid),
            dateAndTime: this.offDays.dateAndTime,
          });
        } else {
          this.location.back();
        }
      }
      this.accounts$.subscribe((res) => {
        this.accountsObject = res;
        this.accounts = res.map((x) => x.identity.fullName);
        if (this.offDays) {
          this.myAccounts = this.offDays.advisors.map((x) => x.name);
        }
        this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
          startWith(''),
          debounceTime(500),
          map((account: string | null) =>
            account
              ? this._filterAccount(account)
              : this.accounts
              ? this.accounts.slice()
              : []
          )
        );
      });
      this.setAdviserValidation();
    });
  }

  ngAfterViewInit() {}

  private _filterAccount(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.accounts.filter((account) =>
      account.toLowerCase().includes(filterValue)
    );
  }

  writeValueAccount(value: string[]) {
    const accounts = value ? value : [];

    this.myAccounts = [...accounts];
  }

  addAccount(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.myAccounts = [...this.myAccounts, value];
    }
    this.accountCtrl.setValue(null);
    this.onTouch();
    this.onModelChange(this.myAccounts);
  }

  removeAccount(data: string): void {
    if(!this.accountsObject || !this.accountsObject.length) {
      return;
    }
    const index = this.myAccounts.findIndex((x) => x == data);

    if (index >= 0 && this.myAccounts && this.myAccounts.length) {
      this.myAccounts.splice(index, 1);

      const selectedUuids = this.accountsObject
        .filter((x) => this.myAccounts.includes(x.identity.fullName))
        .map((id) => id.uuid);
        
      if (selectedUuids) {
        this.form.patchValue({ advisors: selectedUuids });
      }

      this.setAdviserValidation();
      this.onTouch();
      this.onModelChange(this.myAccounts);
    }
  }

  selectedAccount(event: MatAutocompleteSelectedEvent): void {
    const accounts = this.myAccounts ? this.myAccounts : [];

    this.myAccounts = [...accounts, event.option.viewValue];
    const selectedUuids = this.accountsObject
      .filter((x) => this.myAccounts.includes(x.identity.fullName))
      .map((id) => id.uuid);
    if (selectedUuids) {
      this.form.patchValue({ advisors: selectedUuids });
    }
    this.setAdviserValidation();
    this.accountInput.nativeElement.value = '';
    this.accountCtrl.setValue(null);
    this.onTouch();
    this.onModelChange(this.myAccounts);
    this.fElement?.nativeElement?.focus();
  }

  isAccountSelected(account: string): boolean {
    return this.myAccounts && this.myAccounts.some((x) => x === account)
      ? true
      : false;
  }

  setAdviserValidation(): void {
    if (this.myAccounts.length > 0) {
      this.accountCtrl.clearValidators();
      this.accountCtrl.updateValueAndValidity();
    } else {
      this.accountCtrl.setValidators(Validators.compose([Validators.required]));
      this.accountCtrl.updateValueAndValidity();
    }
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    const start = moment(event?.value).toISOString();
    if (!!start) {
      // this.startDate.patchValue(start);
      // this.startDate.updateValueAndValidity();
    }
  }

  changeEndDate(event: MatDatepickerInputEvent<Date>) {
    const end = moment(event?.value).endOf('day').toISOString();
    if (!!end) {
      // this.endDate.patchValue(end);
      // this.endDate.updateValueAndValidity();
    }
  }

  saveOffDays(form: FormGroup): void {
    const { valid, value } = form;
    if (valid) {
      const endDateValue = new Date(this.endDate.value);
      const startDateValue = new Date(this.startDate.value);
      const data: IBranches.IOffDaysItem = {
        uuid: value.uuid,
        reason: value.reason,
        advisors: value.advisors,
        dateAndTime: {
          startDate: `${startDateValue.getFullYear()}-${(
            startDateValue.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}-${startDateValue
            .getDate()
            .toString()
            .padStart(2, '0')}`,
          endDate: `${endDateValue.getFullYear()}-${(
            endDateValue.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}-${endDateValue
            .getDate()
            .toString()
            .padStart(2, '0')}`,
          startTime: this.startTime.value,
          endTime: this.endTime.value,
          onLeave: value.dateAndTime.onLeave,
        },
      };

      const event: IBranches.IOffDaysPayload = {
        branchUuid: this.branchUuid,
        corporateUuid: this.corporateUuid,
        data,
      };
      this.save.emit(event);
    }
  }

  cancel(): void {
    this.cancelEvent.emit();
  }

  onActiveAllDay(event): void {
    if (event.checked) {
      this.startTime.patchValue('');
      this.endTime.patchValue('');
    }
  }
}
