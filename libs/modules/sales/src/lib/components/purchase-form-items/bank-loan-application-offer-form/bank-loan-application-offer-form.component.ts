import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

//Permission
import { permissionTags } from '@neural/shared/data';

// Interfaces
import { IBankLoan, IPurchases, ISales, ITradeIn } from '../../../models';

import { range, loanCalculator, traverseAndRemove } from '../../../functions';
import { Observable } from 'rxjs';
import { filter, map, debounceTime } from 'rxjs/operators';

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
  selector: 'neural-bank-loan-application-offer-form',
  templateUrl: './bank-loan-application-offer-form.component.html',
  styleUrls: [
    './bank-loan-application-offer-form.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BankLoanApplicationOfferFromComponent
  implements OnChanges, OnInit {
  @ViewChildren('bankLoanDoc') bankLoanDocEle: QueryList<
    ElementRef<HTMLInputElement>
  >;

  @Input() purchase: IPurchases.IDocument;

  @Input() enabledDecision!: IBankLoan.IDocument;

  @Input() bankLoan: IBankLoan.IDocument;

  @Input() index: number;

  @Input() permissions: any;

  @Input() bankLoanApplicationOffersUploadedFile: {
    doc: ITradeIn.IDocument;
    index: number;
  };

  @Input() bankLoanApplicationOffersDeletedFile: {
    doc: ISales.IDeleteFileResponse;
    index: number;
  };

  @Input() countries: string[];

  @Output() fileChange = new EventEmitter<ISales.IUploadFile>();

  @Output() deleteFile = new EventEmitter<ISales.IDeleteFile>();

  @Output() updated = new EventEmitter<IBankLoan.IUpdateBankLoan>();

  form: FormGroup;

  calculatorForm: FormGroup;

  documentsForm: FormGroup;

  edit = true;

  formChange$: Observable<any>;

  loanCalculator: number;

  uploadTitleCount = Object.keys(IBankLoan.BankLoanDocumentsTitle).length;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.initialForm();

    this.calculatorForm = this.initialCalculatorForm();

    this.documentsForm = this.fb.group({
      files: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bankLoan && changes.bankLoan.currentValue) {
      this.calculatorForm.patchValue({
        downPayment: this.bankLoan?.loan?.downPayment,
        interestRate: this.bankLoan?.bank?.interestRate * 100,
        period: this.bankLoan?.loan?.period,
      });

      this.patchFormValue(this.bankLoan);
    }

    if (this.enabledDecision && this.bankLoan) {
      this.customerDecisionLogic();
    }

    if (this.updateQuotePermission) {
      this.status.disable();
    }

    if (
      changes.bankLoanApplicationOffersUploadedFile &&
      changes.bankLoanApplicationOffersUploadedFile.currentValue &&
      this.index === this.bankLoanApplicationOffersUploadedFile.index
    ) {
      this.addDocument(this.bankLoanApplicationOffersUploadedFile.doc);
    }

    if (
      changes.bankLoanApplicationOffersDeletedFile &&
      changes.bankLoanApplicationOffersDeletedFile.currentValue &&
      this.index === this.bankLoanApplicationOffersDeletedFile.index
    ) {
      const index = this.documents.controls.findIndex(
        (doc) =>
          doc.get('url').value ===
          this.bankLoanApplicationOffersDeletedFile.doc.url
      );

      if (index !== -1) {
        this.documents.removeAt(index);
      }
    }
  }

  private customerDecisionLogic() {
    if (
      this.enabledDecision.uuid === this.bankLoan.uuid && this.status.value === IBankLoan.BankLoanStatus.APPROVED &&
      !this.updateQuotePermission
    ) {
      this.customerDecision.enable();
    } else {
      this.customerDecision.disable();
    }
  }

  ngOnInit(): void {
    this.formChange$ = this.calculatorForm.statusChanges.pipe(
      debounceTime(500),
      filter((status) => status !== 'INVALID'),
      map(() => {
        const downpayment = parseFloat(this.downPaymentCalculator.value);
        const totalPrice = this.purchase.model.price;
        const monthlyInterest =
          parseFloat(this.interestRateCalculator.value) / 100;
        const yearlyPeriod = parseInt(this.periodCalculator.value, 10);

        this.interestRate.patchValue(monthlyInterest);

        this.loanCalculator =
          totalPrice > downpayment
            ? loanCalculator({
                monthlyInterest,
                yearlyPeriod,
                totalPrice,
                downpayment,
              })
            : 0;

        this.period.patchValue(yearlyPeriod);
        this.monthlyInstallment.patchValue(this.loanCalculator);
        this.downPayment.patchValue(downpayment);
        this.amount.patchValue(totalPrice - downpayment);
      })
    );
  }

  private initialCalculatorForm(): FormGroup {
    return this.fb.group({
      downPayment: ['', Validators.compose([Validators.required])],
      interestRate: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(10),
        ]),
      ],
      period: ['', Validators.compose([Validators.required])],
    });
  }

  private patchFormValue(bankloan: IBankLoan.IDocument): void {
    this.form.patchValue(bankloan);

    if (
      bankloan.status === IBankLoan.BankLoanStatus.APPROVED &&
      !this.updateQuotePermission
    ) {
      this.customerDecision.enable();
    }

    this.emptyDocuments();

    for (const document of bankloan.documents) {
      this.documents.push(this.createDocument(document));
    }
  }

  private initialForm() {
    return this.fb.group({
      uuid: ['', Validators.compose([Validators.required])],
      saleUuid: ['', Validators.compose([Validators.required])],
      customerDecision: [
        {
          value: '',
          disabled: true,
        },
      ],
      status: [''],
      loan: this.loanForm(),
      documents: this.fb.array([]),
      account: this.initAccountForm(),
      bank: this.initialBank(),
    });
  }

  private initialBank(): any {
    return this.fb.group({
      uuid: ['', Validators.compose([Validators.required])],
      interestRate: ['', Validators.compose([Validators.required])],
      name: [''],
    });
  }

  private initAccountForm(): FormGroup {
    return this.fb.group({
      uuid: ['', Validators.compose([Validators.required])],
      identification: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      dateOfBirth: ['', Validators.compose([Validators.required])],
    });
  }

  private loanForm(loan?: IBankLoan.ILoan) {
    return this.fb.group({
      amount: [loan?.amount ?? '', Validators.compose([Validators.required])],
      downPayment: [
        loan?.downPayment ?? '',
        Validators.compose([Validators.required]),
      ],
      monthlyInstallment: [
        loan?.monthlyInstallment ?? '',
        Validators.compose([Validators.required]),
      ],
      period: [loan?.period ?? '', Validators.compose([Validators.required])],
    });
  }

  private addDocument(doc: ITradeIn.IDocument): void {
    if (!!doc) {
      const index = this.documents.controls.findIndex(
        (ctrl) => ctrl.get('title').value === doc.title
      );

      if (index !== -1) {
        this.removeDocument(index);
      }

      return this.documents.push(this.createDocument(doc));
    }
    this.documents.push(this.createDocument());
  }

  private createDocument(document?: ITradeIn.IDocument | null): FormGroup {
    return this.fb.group({
      title: [document?.title ?? '', Validators.compose([Validators.required])],
      url: [document?.url ?? '', Validators.compose([Validators.required])],
      size: [document?.size ?? '', Validators.compose([Validators.required])],
      mime: [document?.mime ?? '', Validators.compose([Validators.required])],
    });
  }

  onChangeStatus(event: MatSelectChange) {
    const { value } = event;

    if (
      value === IBankLoan.BankLoanStatus.APPROVED &&
      this.enabledDecision.uuid === this.bankLoan.uuid &&
      !this.updateQuotePermission
    ) {
      return this.customerDecision.enable();
    }
    return this.customerDecision.disable();
  }

  emptyDocuments() {
    while (this.documents.controls.length) {
      this.documents.removeAt(0);
    }
  }

  removeDocument(index: number): void {
    return this.documents.removeAt(index);
  }

  onClickBankLoanDoc(title: string) {
    const fileUpload = this.bankLoanDocEle.find(
      (x) => x.nativeElement.id === `upload-${title}-${this.index}`
    ).nativeElement;

    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }

  onUploadFile(event: Event, title: IBankLoan.BankLoanDocumentsTitle | string) {
    const file = (event.target as HTMLInputElement).files[0];

    const uploadedFile: ISales.IUploadFile = {
      accountUuid: this.purchase?.account?.uuid,
      saleUuid: this.purchase?.uuid,
      type: ISales.UploadLocationType.ADDITIONAL,
      title,
      file: file,
    };

    this.fileChange.emit(uploadedFile);
  }

  onDeleteFile(formCtrl: FormGroup): void {
    const { value, valid } = formCtrl;

    if (valid) {
      const payload: ISales.IDeleteFile = {
        uuid: this.purchase?.account?.uuid,
        url: value,
        type: ISales.UploadLocationType.ADDITIONAL,
        saleUuid: this.purchase?.uuid,
      };

      this.deleteFile.emit(payload);
    }
  }

  onUpdate(form: FormGroup) {
    const { valid, value } = form;
    if (valid && this.updatePermission) {
      traverseAndRemove(value);
      this.updated.emit(value);
    }
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = moment(event?.value).toISOString().toString();

      this.dateOfBirth.setValue(date, {
        onlySelf: true,
      });
    }
  }

  titleInDocuments(title: string): string {
    return this.documents.controls.find(
      (item) => item.get('title').value === title
    )?.value;
  }

  get formDisabled(): boolean {
    return this.form.disabled;
  }

  get loan(): FormGroup {
    return this.form.get('loan') as FormGroup;
  }

  get bank(): FormGroup {
    return this.form.get('bank') as FormGroup;
  }

  get interestRate(): FormControl {
    return this.bank.get('interestRate') as FormControl;
  }

  get customerDecision(): FormGroup {
    return this.form.get('customerDecision') as FormGroup;
  }

  get documents(): FormArray {
    return this.form.get('documents') as FormArray;
  }

  get downPayment(): FormControl {
    return this.loan.get('downPayment') as FormControl;
  }

  get amount(): FormControl {
    return this.loan.get('amount') as FormControl;
  }

  get monthlyInstallment(): FormControl {
    return this.loan.get('monthlyInstallment') as FormControl;
  }

  get period(): FormControl {
    return this.loan.get('period') as FormControl;
  }

  get status(): FormControl {
    return this.form.get('status') as FormControl;
  }

  get account(): FormControl {
    return this.form.get('account') as FormControl;
  }

  get nationality(): FormControl {
    return this.account.get('nationality') as FormControl;
  }

  get identification(): FormControl {
    return this.account.get('identification') as FormControl;
  }

  get dateOfBirth(): FormControl {
    return this.account.get('dateOfBirth') as FormControl;
  }

  get years(): number[] {
    return range(1, 9, 1);
  }

  get bankLoanStatus() {
    return IBankLoan.BankLoanStatus;
  }

  get bankLoanDocumentsCustomerDecision() {
    return IBankLoan.BankLoanDocumentsCustomerDecision;
  }

  get bankLoanDocumentsTitle() {
    return IBankLoan.BankLoanDocumentsTitle;
  }

  get bankLoanDocumentsTitleLists(): string[] {
    return Object.values(IBankLoan.BankLoanDocumentsTitle).filter((x) => {
      if (this.updateQuotePermission) {
        return x !== IBankLoan.BankLoanDocumentsTitle.APPROVAL_DOCUMENT;
      }
      return x;
    });
  }

  get filesArray(): FormArray {
    return this.documentsForm.get('files') as FormArray;
  }

  get periodCalculator(): FormControl {
    return this.calculatorForm.get('period') as FormControl;
  }

  get interestRateCalculator(): FormControl {
    return this.calculatorForm.get('interestRate') as FormControl;
  }

  get downPaymentCalculator(): FormControl {
    return this.calculatorForm.get('downPayment') as FormControl;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.BankLoan.UPDATE_BANK_LOAN]
    ) {
      return true;
    }
    return false;
  }

  get updateQuotePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.UPDATE_PURCHASE_QUOTE]
    ) {
      return true;
    }
    return false;
  }
}
