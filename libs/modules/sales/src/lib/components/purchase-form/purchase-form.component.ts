import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { Auth } from '@neural/auth';
import { ISalesAdvisor } from '@neural/modules/administration';
import { IModels } from '@neural/modules/models';

// Facades
import { PurchasesFacade } from '../../+state/facades';
import { BankLoansBySaleFacade } from '../../+state/facades';

// Model
import { IBankLoan, IPurchases, ISales, ITradeIn } from '../../models';
import { IVehicle } from '@neural/modules/customer/vehicles';

// Observable
import { Observable, of } from 'rxjs';

// permission tags
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'neural-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseFormComponent implements OnInit, OnChanges {
  @ViewChild('loanAdditionalDoc', { static: false })
  loanAdditionalDocEle: ElementRef<HTMLInputElement>;

  @Input() purchase: IPurchases.IDocument;

  @Input() permissions: any;

  @Input() salesAdvisors: ISalesAdvisor.ISADocument[];

  @Input() selectedBranch: Auth.IBranch;

  @Output() loaded: EventEmitter<IPurchases.IDocument> = new EventEmitter<
    IPurchases.IDocument
  >();

  @Output() updated = new EventEmitter<{
    changes: IPurchases.IUpdate;
    sale: IPurchases.IDocument;
  }>(); // change sales to purchase

  @Output() createdTradeIn = new EventEmitter<ITradeIn.ICreate>();

  @Output() updatedTradeIn = new EventEmitter<{
    document: ITradeIn.ITradeInDocumnet;
    changes: ITradeIn.IUpdate;
  }>();

  @Output() branchChange = new EventEmitter();

  @Output() allBadgesChanges = new EventEmitter<string>();

  @Output() refreshChanges = new EventEmitter<string>();

  unit$: Observable<IModels.IUnitList>;

  tradeInUploadedFile$: Observable<ITradeIn.IDocument>;

  tradeInDeletedFile$: Observable<ISales.IDeleteFileResponse>;

  bankLoanUploadedFile$: Observable<ITradeIn.IDocument>;

  bankLoanDeletedFile$: Observable<ISales.IDeleteFileResponse>;

  tradeInInspectionUploadedFile$: Observable<ITradeIn.IDocument>;

  tradeInInspectionDeletedFile$: Observable<ISales.IDeleteFileResponse>;

  tradeInOfferUploadedFile$: Observable<ITradeIn.IDocument>;

  tradeInOfferDeletedFile$: Observable<ISales.IDeleteFileResponse>;

  bankLoanApplicationOffersUploadedFile$: Observable<{
    doc: ITradeIn.IDocument;
    index: number;
  }>;

  bankLoanApplicationOffersDeletedFile$: Observable<{
    doc: ISales.IDeleteFileResponse;
    index: number;
  }>;

  globalVehicles$: Observable<IVehicle.IGlobalVehicle>;

  loans$: Observable<IBankLoan.IDocument[]>;

  countries$: Observable<string[]>;

  constructor(
    private cdr: ChangeDetectorRef,
    private purchasesFacade: PurchasesFacade,
    private bankLoansBySaleFacade: BankLoansBySaleFacade,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.unit$ = this.purchasesFacade.unit$;
    this.globalVehicles$ = this.purchasesFacade.globalVehicles$;

    this.loans$ = this.bankLoansBySaleFacade.loans$;

    this.onLoadCountries();
  }

  onClickloanAdditionalDoc() {
    const fileUpload = this.loanAdditionalDocEle.nativeElement;
    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.purchase && changes.purchase.currentValue) {
      this.loaded.emit(this.purchase);
    }

    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }
  }

  onBrandSeries(event: { brand: string; series: string }): void {
    this.purchasesFacade.onListSeriesModels(event);
  }

  onModelBrandSeries(event: IModels.IVariant): void {
    this.purchasesFacade.onListVariants(event);
  }

  onUpdate(changes: IPurchases.IUpdate) {
    const sale: IPurchases.IDocument = this.purchase;

    this.updated.emit({
      changes,
      sale,
    });
  }

  onCreateTradeIn(payload: ITradeIn.ICreate) {
    this.createdTradeIn.emit(payload);
  }

  onUpdateTradeIn(changes: ITradeIn.IUpdate) {
    const { tradeIn } = this.purchase;

    this.updatedTradeIn.emit({
      document: tradeIn,
      changes,
    });
  }

  onClearBadge(event: IPurchases.IUpdateBadge) {
    this.purchasesFacade.onClearBadge(event);
  }

  onClearAllBadges() {
    const { uuid } = this.purchase;
    this.allBadgesChanges.emit(uuid);
  }

  onRefresh() {
    const { uuid } = this.purchase;
    this.refreshChanges.emit(uuid);
  }

  onGlobalBrandChange(event?: any): void {
    this.purchasesFacade.onLoadGlobalBrands();
  }

  onGlobalModelChange(payload: { brand: string }): void {
    this.purchasesFacade.onLoadGlobalModels(payload);
  }

  onGlobalVariantChange(payload: { brand: string; model: string }): void {
    this.purchasesFacade.onLoadGlobalVariants(payload);
  }

  onFileChange(payload: ISales.IUploadFile): void {
    this.tradeInUploadedFile$ = this.purchasesFacade
      .onUploadDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onDeleteFile(payload: ISales.IDeleteFile): void {
    this.tradeInDeletedFile$ = this.purchasesFacade
      .onDeleteDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onFileBankLoanChange(payload: ISales.IUploadFile): void {
    this.bankLoanUploadedFile$ = this.purchasesFacade
      .onUploadDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onDeleteBankLoanFile(payload: ISales.IDeleteFile): void {
    this.bankLoanDeletedFile$ = this.purchasesFacade
      .onDeleteDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onFileInspectionChange(payload: ISales.IUploadFile): void {
    this.tradeInInspectionUploadedFile$ = this.purchasesFacade
      .onUploadDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onDeleteInspectionFile(payload: ISales.IDeleteFile): void {
    this.tradeInInspectionDeletedFile$ = this.purchasesFacade
      .onDeleteDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onFileOfferChange(payload: ISales.IUploadFile): void {
    this.tradeInOfferUploadedFile$ = this.purchasesFacade
      .onUploadDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onDeleteOfferFile(payload: ISales.IDeleteFile): void {
    this.tradeInOfferDeletedFile$ = this.purchasesFacade
      .onDeleteDocument(payload)
      .pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onUploadBankLoanApplicationOffersFile({
    doc : data,
    index,
  }: {
    doc: ISales.IUploadFile;
    index: number;
  }): void {
    this.bankLoanApplicationOffersUploadedFile$ = this.purchasesFacade
      .onUploadDocument(data)
      .pipe(
        map((doc) => {
          return {
            doc,
            index,
          };
        }),
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onDeleteBankLoanApplicationOffersFile({
    doc: data,
    index,
  }: {
    doc: ISales.IDeleteFile;
    index: number;
  }): void {
    this.bankLoanApplicationOffersDeletedFile$ = this.purchasesFacade
      .onDeleteDocument(data)
      .pipe(
        map((doc) => {
          return {
            doc,
            index,
          };
        }),
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
  }

  onLoadCountries() {
    this.countries$ = this.bankLoansBySaleFacade.loadCountryNames().pipe(
      catchError((res: any) => {
        this.toggleSnackbar(res.error.response.message);
        return of(null);
      })
    );
  }

  onCreateBankLoans(payload: IBankLoan.CreateLoans): void {
    this.bankLoansBySaleFacade.createBankLoans(payload);
  }

  onUpdateFullFillment(payload: {
    uuid: string;
    fullFillment: IPurchases.ISaleFulfillment;
  }): void {
    this.purchasesFacade.onUpdateFullFillment(payload);
  }

  onDeleteLoan(payload: string): void {
    this.bankLoansBySaleFacade.onDeleteBankLoan(payload);
  }

  onUpdateBankLoan(payload: IBankLoan.IUpdateBankLoan) {
    this.bankLoansBySaleFacade.onUpdateBankLoan(payload);
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
