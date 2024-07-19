import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

//Model
import { IPurchases, ISales, ITradeIn } from '../../../models';

// Angular forms
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

//Data Lib
import { permissionTags } from '@neural/shared/data';
import { traverseAndRemove } from '../../../functions';

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
import { MatSelectChange } from '@angular/material/select';

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
  selector: 'neural-trade-in-offer',
  templateUrl: './trade-in-offer.component.html',
  styleUrls: [
    './trade-in-offer.component.scss',
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
export class TradeInOfferComponent implements OnChanges {
  @Input() purchase: IPurchases.IDocument;

  @Input() permissions: any;

  @Input() tradeInOfferUploadedFile: ITradeIn.IDocument;

  @Input() tradeInOfferDeletedFile: ISales.IDeleteFileResponse;

  @ViewChild('tradeInOfferDoc', { static: false })
  tradeInOfferDocEle: ElementRef<HTMLInputElement>;

  @Output() badgeChanges = new EventEmitter<IPurchases.IUpdateBadge>();

  @Output() update = new EventEmitter<ITradeIn.IUpdate>();

  @Output() deleteFile = new EventEmitter<ISales.IDeleteFile>();

  @Output() fileChange = new EventEmitter<ISales.IUploadFile>();

  form: FormGroup;

  tradeInOffer = true;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.form = this.initalForm();
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = moment(event?.value).toISOString();

      this.offer.get('validity').setValue(date, {
        onlySelf: true,
      });
    }
  }

  private initalForm(): FormGroup {
    return this.fb.group({
      offer: this.fb.group({
        customerDecision: [''],
        isLocked: [false, Validators.compose([Validators.required])],
        approximateValue: ['', Validators.compose([Validators.required])],
        status: ['', Validators.compose([Validators.required])],
        validity: ['', Validators.compose([Validators.required])],
        valuation: this.createValuation(),
        remark: [''],
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.purchase &&
      changes.purchase.currentValue &&
      !!this.purchase?.tradeIn
    ) {
      this.patchFormValue(this.purchase?.tradeIn);
      this.tradeInOffer = true;

      this._statusLogic(this.purchase?.tradeIn?.offer?.status);
    }

    if (
      changes.tradeInOfferUploadedFile &&
      changes.tradeInOfferUploadedFile.currentValue
    ) {
      this.valuation.patchValue(this.tradeInOfferUploadedFile);
    }

    if (
      changes.tradeInOfferDeletedFile &&
      changes.tradeInOfferDeletedFile.currentValue
    ) {
      this.valuation.reset();
    }
  }

  private patchFormValue(tradeIn: ITradeIn.ITradeInDocumnet) {
    if (!!tradeIn && !!tradeIn?.offer) {
      const updatedDocument: ITradeIn.IUpdate = {
        offer: tradeIn?.offer,
      };
      this.form.patchValue(updatedDocument);

      this.tradeInOffer = true;
    }
  }

  onClickDocFileTradeInOffer() {
    const fileUpload = this.tradeInOfferDocEle.nativeElement;
    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }

  onUploadFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const uploadedFile: ISales.IUploadFile = {
      accountUuid: this.purchase?.account?.uuid,
      saleUuid: this.purchase?.uuid,
      type: ISales.UploadLocationType.TRADE_IN_OFFER,
      title: ISales.ValuationTitle.VALUATION_DOCUMENT,
      file: file,
    };

    this.fileChange.emit(uploadedFile);
  }

  onClearBadge() {
    const payload: IPurchases.IUpdateBadge = {
      uuid: this.purchase.uuid,
      section: IPurchases.BadgeSection.TRADE_IN,
    };

    this.badgeChanges.emit(payload);
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }

  onEdit() {
    this.tradeInOffer = !this.tradeInOffer;
  }

  onUpdate(form: FormGroup): void {
    const { value, valid } = form;

    if (valid && this.updatePermission) {
      const updateDocument = { ...value };
      traverseAndRemove(updateDocument);

      this.update.emit(updateDocument);
    }
  }

  onDeleteFile(formCtrl: FormControl): void {
    const { value, valid } = formCtrl;

    if (valid) {
      const payload: ISales.IDeleteFile = {
        uuid: this.purchase?.account?.uuid,
        url: value,
        type: ISales.UploadLocationType.TRADE_IN_OFFER,
        saleUuid: this.purchase?.uuid,
      };

      this.deleteFile.emit(payload);
    }
  }

  onStatusChange(event: MatSelectChange): void {
    const { value } = event;

    this._statusLogic(value);
  }

  private _statusLogic(value: ITradeIn.OfferStatus) {
    if (value === this.offerStatus.REJECTED) {
      this.approximateValue.clearValidators();
      this.approximateValue.updateValueAndValidity();

      this.remark.setValidators([Validators.compose([Validators.required])]);
      this.remark.updateValueAndValidity();

      this.customerDecisionCtrl.disable();
    } else if (value === this.offerStatus.IN_PROCESS) {
      this.validity.clearValidators();
      this.validity.updateValueAndValidity();

      this.remark.clearValidators();
      this.remark.updateValueAndValidity();

      this.approximateValue.clearValidators();
      this.approximateValue.updateValueAndValidity();
    } else {
      this.validity.setValidators([Validators.compose([Validators.required])]);
      this.validity.updateValueAndValidity();

      this.approximateValue.setValidators([
        Validators.compose([Validators.required]),
      ]);
      this.approximateValue.updateValueAndValidity();

      this.remark.clearValidators();
      this.remark.updateValueAndValidity();

      this.customerDecisionCtrl.enable();
    }
  }

  get offer(): FormGroup {
    return this.form.get('offer') as FormGroup;
  }

  get validity(): FormControl {
    return this.offer.get('validity') as FormControl;
  }

  get approximateValue(): FormControl {
    return this.offer.get('approximateValue') as FormControl;
  }

  get customerDecisionCtrl(): FormControl {
    return this.offer.get('customerDecision') as FormControl;
  }

  get valuation(): FormControl {
    return this.offer.get('valuation') as FormControl;
  }

  get remark(): FormControl {
    return this.offer.get('remark') as FormControl;
  }

  get customerDecisionStatus(): FormControl {
    return this.offer.get('customerDecision') as FormControl;
  }

  get status(): FormControl {
    return this.offer.get('status') as FormControl;
  }

  get offerStatus() {
    return ITradeIn.OfferStatus;
  }

  get valuationTitle() {
    return ISales.ValuationTitle;
  }

  get customerDecision() {
    return ITradeIn.CustomerDecision;
  }

  get formDisabled(): boolean {
    return this.form.disabled;
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
}
