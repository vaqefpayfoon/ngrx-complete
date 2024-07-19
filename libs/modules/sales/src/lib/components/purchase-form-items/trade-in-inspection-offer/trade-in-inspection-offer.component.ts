import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

//Angular forms
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

//Permission
import { permissionTags, traverseAndRemove } from '@neural/shared/data';

//Model
import { IPurchases, ISales, ITradeIn } from '../../../models';

//Snackbar
import { MatSnackBar } from '@angular/material/snack-bar';

// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

const moment = _rollupMoment || _moment;

// Format date picker
const MY_FORMATS = {
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
  selector: 'neural-trade-in-inspection-offer',
  templateUrl: './trade-in-inspection-offer.component.html',
  styleUrls: [
    './trade-in-inspection-offer.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TradeInInspectionOfferComponent implements OnChanges {
  @Input() permissions: any;

  @Input() purchase: IPurchases.IDocument;

  @Input() tradeInInspectionUploadedFile: ITradeIn.IDocument;

  @Input() tradeInInspectionDeletedFile: ISales.IDeleteFileResponse;

  @ViewChild('tradeInInspectionOfferDoc', { static: false })
  tradeInInspectionOfferDocEle: ElementRef<HTMLInputElement>;

  @Output() badgeChanges = new EventEmitter<IPurchases.IUpdateBadge>();

  @Output() update = new EventEmitter<ITradeIn.IUpdate>();

  @Output() fileChange = new EventEmitter<ISales.IUploadFile>();

  @Output() deleteFile = new EventEmitter<ISales.IDeleteFile>();

  tradeInInspectionOffer = true;

  form: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.initialForm();
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = moment(event?.value).toISOString();

      this.validity.setValue(date, {
        onlySelf: true,
      });
    }
  }

  onClicktradeInInspectionOfferDoc() {
    const fileUpload = this.tradeInInspectionOfferDocEle.nativeElement;
    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }

  private initialForm(): FormGroup {
    return this.fb.group({
      inspection: this.fb.group({
        offer: this.fb.group({
          finalValue: ['', Validators.compose([Validators.required])],
          validity: ['', Validators.compose([Validators.required])],
          customerDecision: [''],
          remark: [''],
          valuation: this.createValuation(),
          isLocked: [false, Validators.compose([Validators.required])],
        }),
      }),
    });
  }

  private createValuation(): FormGroup {
    return this.fb.group({
      url: [''],
      title: [''],
      mime: [''],
      size: [''],
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

      this.tradeInInspectionOffer = true;
    }

    if (
      changes.tradeInInspectionUploadedFile &&
      changes.tradeInInspectionUploadedFile.currentValue
    ) {
      this.valuation.patchValue(this.tradeInInspectionUploadedFile);
    }

    if (
      changes.tradeInInspectionDeletedFile &&
      changes.tradeInInspectionDeletedFile.currentValue
    ) {
      this.valuation.reset();
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
    this.tradeInInspectionOffer = !this.tradeInInspectionOffer;
    if (this.purchase?.tradeIn?.offer?.status === this.offerStatus.REJECTED) {
      this.customerDecisionCtrl.disable();
    }
  }

  onUpdate(form: FormGroup): void {
    const { valid, value } = form;

    if (this.updatePermission && valid) {
      traverseAndRemove(value);
      this.update.emit(value);
      this.tradeInInspectionOffer = !this.tradeInInspectionOffer;
    }
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }

  onUploadFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const uploadedFile: ISales.IUploadFile = {
      accountUuid: this.purchase?.account?.uuid,
      saleUuid: this.purchase?.uuid,
      type: ISales.UploadLocationType.TRADE_IN_INSPECTION_OFFER,
      title: ISales.ValuationTitle.VALUATION_DOCUMENT,
      file: file,
    };

    this.fileChange.emit(uploadedFile);
  }

  onDeleteFile(formCtrl: FormControl): void {
    const { value, valid } = formCtrl;

    if (valid) {
      const payload: ISales.IDeleteFile = {
        uuid: this.purchase?.account?.uuid,
        url: value,
        type: ISales.UploadLocationType.TRADE_IN_INSPECTION_OFFER,
        saleUuid: this.purchase?.uuid,
      };

      this.deleteFile.emit(payload);
    }
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

  get inspection(): FormGroup {
    return this.form.get('inspection') as FormGroup;
  }

  get offer(): FormGroup {
    return this.inspection.get('offer') as FormGroup;
  }

  get valuation(): FormControl {
    return this.offer.get('valuation') as FormControl;
  }

  get validity(): FormControl {
    return this.offer.get('validity') as FormControl;
  }

  get customerDecisionCtrl(): FormControl {
    return this.offer.get('customerDecision') as FormControl;
  }

  get customerDecision() {
    return ITradeIn.CustomerDecision;
  }

  get customerDecisionAccepted() {
    return (
      ITradeIn.CustomerDecision.ACCEPTED ===
      this.purchase?.tradeIn?.offer?.customerDecision
    );
  }

  get offerStatus() {
    return ITradeIn.OfferStatus;
  }

  get valuationTitle() {
    return ISales.ValuationTitle.VALUATION_DOCUMENT;
  }

  get formDisabled() {
    return this.form.disabled;
  }
}
