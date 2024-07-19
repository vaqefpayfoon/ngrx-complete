import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
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

// Models
import { IBankLoan, IPurchases, ISales, ITradeIn } from '../../../models';

//Forms
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';

//Permission
import { permissionTags } from '@neural/shared/data';

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
  selector: 'neural-bank-loan-application-form',
  templateUrl: './bank-loan-application-form.component.html',
  styleUrls: [
    './bank-loan-application-form.component.scss',
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
export class BankLoanApplicationFormComponent implements OnChanges, OnInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() loansBySaleUuid: IBankLoan.IDocument[];

  @Input() bankLoanUploadedFile: ITradeIn.IDocument;

  @Input() bankLoanDeletedFile: ISales.IDeleteFileResponse;

  @Input() permissions: any;

  @Input() countries: string[];

  @Output() created = new EventEmitter<IBankLoan.CreateLoans>();

  @ViewChildren('bankLoanDoc') bankLoanDocEle: QueryList<
    ElementRef<HTMLInputElement>
  >;

  @Output() fileChange = new EventEmitter<ISales.IUploadFile>();

  @Output() deleteFile = new EventEmitter<ISales.IDeleteFile>();

  @Output() deleteLoan = new EventEmitter<IBankLoan.IDeleteBankLoan>();

  form: FormGroup;

  documentsForm: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.initForm();

    this.documentsForm = this.fb.group({
      files: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.purchase && changes.purchase.currentValue && this.purchase) {
      this.uuid.patchValue(this.purchase.account.uuid);
      this.saleUuid.patchValue(this.purchase.uuid);
      this.corporateUuid.patchValue(this.purchase.corporate.uuid);
    }

    if (
      changes.bankLoanUploadedFile &&
      changes.bankLoanUploadedFile.currentValue
    ) {
      this.addDocument(this.bankLoanUploadedFile);
    }

    if (
      changes.bankLoanDeletedFile &&
      changes.bankLoanDeletedFile.currentValue
    ) {
      const index = this.documents.controls.findIndex(
        (x: FormControl) => x.get('url').value === this.bankLoanDeletedFile.url
      );

      if (index !== -1) {
        this.removeDocument(index);
      }
    }

    if (changes.loansBySaleUuid && !changes.loansBySaleUuid.firstChange) {
      this.emptyLoans();
      this.emptyDocuments();
      this.identification.patchValue('');
      this.dateOfBirth.patchValue('');
      this.nationality.patchValue('');
    }
  }

  ngOnInit(): void {}

  private initForm(): FormGroup {
    return this.fb.group({
      account: this.initAccountForm(),
      saleUuid: ['', Validators.compose([Validators.required])],
      corporateUuid: ['', Validators.compose([Validators.required])],
      loans: this.fb.array([], Validators.compose([Validators.required])),
      documents: this.fb.array([], Validators.compose([Validators.required])),
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

  private createLoan(): FormGroup {
    return this.fb.group({
      bankUuid: ['', Validators.compose([Validators.required])],
      loan: this.fb.group({
        amount: ['', Validators.compose([Validators.required])],
        downPayment: ['', Validators.compose([Validators.required])],
        interestRate: ['', Validators.compose([Validators.required])],
        monthlyInstallment: ['', Validators.compose([Validators.required])],
        period: ['', Validators.compose([Validators.required])],
      }),
    });
  }

  addLoan(loan: IBankLoan.ISelfBankLoans): void {
    if (loan) {
      const createLoan = this.fb.group({
        bankUuid: [loan.bankUuid, Validators.compose([Validators.required])],
        loan: this.fb.group({
          amount: [
            this.purchase.model.price - loan.loan.downPayment,
            Validators.compose([Validators.required]),
          ],
          downPayment: [
            loan.loan.downPayment,
            Validators.compose([Validators.required]),
          ],
          interestRate: [
            loan.loan.interestRate / 100,
            Validators.compose([Validators.required]),
          ],
          monthlyInstallment: [
            loan.loan.monthlyInstallment,
            Validators.compose([Validators.required]),
          ],
          period: [loan.loan.period, Validators.compose([Validators.required])],
        }),
      });

      this.loans.push(createLoan);
    }
  }

  removeLoan(index: number): void {
    this.loans.removeAt(index);
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = moment(event?.value).toISOString().toString();

      this.dateOfBirth.setValue(date, {
        onlySelf: true,
      });
    }
  }

  onDeleteFile(formCtrl: FormControl): void {
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

  private emptyLoans(): void {
    while (this.loans.controls.length) {
      this.loans.removeAt(0);
    }
  }

  private createDocument(document?: ITradeIn.IDocument | null): FormGroup {
    return this.fb.group({
      title: [document?.title ?? '', Validators.compose([Validators.required])],
      url: [document?.url ?? '', Validators.compose([Validators.required])],
      size: [document?.size ?? '', Validators.compose([Validators.required])],
      mime: [document?.mime ?? '', Validators.compose([Validators.required])],
    });
  }

  removeDocument(index: number): void {
    return this.documents.removeAt(index);
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

  emptyDocuments() {
    while (this.documents.controls.length) {
      this.documents.removeAt(0);
    }
  }

  onCreate(form: FormGroup): void {
    const { value, valid } = form;

    if (valid) {
      this.created.emit(value);
    }
  }

  onClickBankLoanDoc(title: string) {
    const fileUpload = this.bankLoanDocEle.find(
      (x) => x.nativeElement.id === `upload-${title}`
    ).nativeElement;

    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }

  onUploadFile(event: Event, title: ISales.UploadLoanDocumnetTypes | string) {
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

  onDeleteLoan(payload: IBankLoan.IDeleteBankLoan): void {
    this.deleteLoan.emit(payload);
  }

  get loans(): FormArray {
    return this.form.get('loans') as FormArray;
  }

  get account(): FormGroup {
    return this.form.get('account') as FormGroup;
  }

  get dateOfBirth(): FormControl {
    return this.account.get('dateOfBirth') as FormControl;
  }

  get documents(): FormArray {
    return this.form.get('documents') as FormArray;
  }

  get uuid(): FormControl {
    return this.account.get('uuid') as FormControl;
  }

  get saleUuid(): FormControl {
    return this.form.get('saleUuid') as FormControl;
  }

  get corporateUuid(): FormControl {
    return this.form.get('corporateUuid') as FormControl;
  }

  get nationality(): FormControl {
    return this.account.get('nationality') as FormControl;
  }

  get identification(): FormControl {
    return this.account.get('identification') as FormControl;
  }

  get filesArray(): FormArray {
    return this.documentsForm.get('files') as FormArray;
  }

  get uploadLoanDocumnetTypesList(): string[] {
    return Object.values(ISales.UploadLoanDocumnetTypes);
  }

  get uploadLoanDocumnetTypes() {
    return ISales.UploadLoanDocumnetTypes;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.BankLoan.CREATE_BANK_LOANS]
    ) {
      return true;
    }
    return false;
  }
}
