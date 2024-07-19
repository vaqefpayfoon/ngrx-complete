import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// Model
import { IPurchases, ITradeIn } from '../../../models';

// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';

// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'LL, LTS',
  },
  display: {
    dateInput: 'LL, LTS',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

import { permissionTags } from '@neural/shared/data';

import { NgxMatMomentAdapter } from '@angular-material-components/moment-adapter';
@Component({
  selector: 'neural-trade-in-inspection-request',
  templateUrl: './trade-in-inspection-request.component.html',
  styleUrls: [
    './trade-in-inspection-request.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  providers: [
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {
      provide: NgxMatDateAdapter,
      useClass: NgxMatMomentAdapter,
    },
  ],
})
export class TradeInInspectionRequestComponent implements OnChanges {
  @Input() permissions: any;

  @Input() purchase: IPurchases.IDocument;

  tradeInInspection = true;

  @Output() badgeChanges = new EventEmitter<IPurchases.IUpdateBadge>();

  @Output() update = new EventEmitter<ITradeIn.IUpdate>();

  form: FormGroup;

  minDate: _moment.Moment;

  constructor(private fb: FormBuilder) {
    this.form = this.initialForm();

    this.minDate = moment();
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = moment(event?.value).toISOString();

      this.request.get('date').setValue(date, {
        onlySelf: true,
      });
    }
  }

  private initialForm(): FormGroup {
    return this.fb.group({
      inspection: this.fb.group({
        request: this.fb.group({
          date: ['', Validators.compose([Validators.required])],
          remark: [''],
        }),
      }),
    });
  }

  private patchFormValue(purchase: IPurchases.IDocument) {
    const { tradeIn } = purchase;
    if (!!purchase && !!tradeIn && !!tradeIn?.inspection) {
      const updatedDocument: ITradeIn.IUpdate = {
        inspection: tradeIn?.inspection,
      };

      this.form.patchValue(updatedDocument);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.purchase && changes.purchase.currentValue) {
      this.patchFormValue(this.purchase);

      this.tradeInInspection = true;
    }
  }

  onClearBadge() {
    const payload: IPurchases.IUpdateBadge = {
      uuid: this.purchase.uuid,
      section: IPurchases.BadgeSection.TRADE_IN,
    };

    this.badgeChanges.emit(payload);
  }

  onEdit() {
    this.tradeInInspection = !this.tradeInInspection;
    this.form.enable();
  }

  onUpdateTradeIn(form: FormGroup) {
    const { value, valid } = form;

    if (valid && this.updatePermission) {
      this.update.emit(value);
      this.form.disable();
      this.tradeInInspection = !this.tradeInInspection;
    }
  }

  get inspection(): FormGroup {
    return this.form.get('inspection') as FormGroup;
  }

  get request(): FormGroup {
    return this.inspection.get('request') as FormGroup;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.TradeIn.UPDATE_TRADE_IN]
    ) {
      return true;
    }
    return false;
  }

  get customerDecisionAccepted() {
    return (
      ITradeIn.CustomerDecision.ACCEPTED ===
      this.purchase?.tradeIn?.offer?.customerDecision
    );
  }
}
