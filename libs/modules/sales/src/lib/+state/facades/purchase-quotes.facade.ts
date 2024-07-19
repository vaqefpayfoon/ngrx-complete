import { Injectable, Injector } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ISalesState } from '../reducers';

// Selector
import { purchaseQuoteQuery } from '../selectors';

// Action
import { PurchaseQuotesActions } from '../actions';

// Model
import { IPurchases, ISales, ITradeIn } from '../../models';

import { IModels } from '@neural/modules/models';

//Service
import { SalesService, PurchaseQuoteService } from '../../services';

//Rxjs
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseQuotesFacade {
  loaded$ = this.store.select(purchaseQuoteQuery.getPurchaseQuotesLoaded);

  loading$ = this.store.select(purchaseQuoteQuery.getPurchaseQuotesLoading);

  error$ = this.store.select(purchaseQuoteQuery.getPurchaseQuotesError);

  purchases$ = this.store.select(purchaseQuoteQuery.getAllPurchaseQuotes);

  purchase$ = this.store.select(purchaseQuoteQuery.getSelectedPurchaseQuote);

  purchasesConfig$ = this.store.select(
    purchaseQuoteQuery.getPurchaseQuotesPage
  );

  getPurchasesFilters$ = this.store.select(
    purchaseQuoteQuery.getPurchaseQuotesFilters
  );

  getPurchasesSorts$ = this.store.select(
    purchaseQuoteQuery.getPurchaseQuotesSorts
  );

  total$ = this.store.select(purchaseQuoteQuery.getPurchaseQuotesTotal);

  salesAdvisors$ = this.store.select(purchaseQuoteQuery.getQuotesSalesAdvisor);

  unit$ = this.store.select(purchaseQuoteQuery.getQuotesUnit);

  globalVehicles$ = this.store.select(
    purchaseQuoteQuery.getQuotesGlobalVehicle
  );

  constructor(private store: Store<ISalesState>, private injector: Injector) {}

  private _purchaseQuoteService: PurchaseQuoteService;
  public get purchaseQuoteService(): PurchaseQuoteService {
    if (!this._purchaseQuoteService) {
      this._purchaseQuoteService = this.injector.get(PurchaseQuoteService);
    }
    return this._purchaseQuoteService;
  }

  private _salesService: SalesService;
  public get salesService(): SalesService {
    if (!this._salesService) {
      this._salesService = this.injector.get(SalesService);
    }
    return this._salesService;
  }

  changePurchaseQuotesPage(config: ISales.IConfig) {
    this.store.dispatch(
      PurchaseQuotesActions.ChangePurchaseQuotesPage({ payload: config })
    );
  }

  changePurchaseQuotesFilter(filter: ISales.IFilter) {
    this.store.dispatch(
      PurchaseQuotesActions.SetPurchaseQuotesFilters({ payload: filter })
    );
  }

  resetPurchaseQuotesPage() {
    const params: ISales.IConfig = {
      page: 1,
      limit: ISales.Config.LIMIT,
    };
    this.store.dispatch(
      PurchaseQuotesActions.SetPurchaseQuotesPage({ payload: params })
    );
  }

  onUpdate(payload: {
    changes: IPurchases.IUpdate;
    sale: IPurchases.IDocument;
  }) {
    this.store.dispatch(PurchaseQuotesActions.UpdatePurchaseQuote({ payload }));
  }

  onResetSelectedPurchaseQuote() {
    this.store.dispatch(PurchaseQuotesActions.ResetSelectedPurchaseQuote());
  }

  getPurchase(uuid: string) {
    this.store.dispatch(
      PurchaseQuotesActions.GetPurchaseQuote({ payload: uuid })
    );
  }

  onRedirect() {
    this.store.dispatch(PurchaseQuotesActions.RedirectToPurchaseQuote());
  }

  getBrandsAndSeries() {
    this.store.dispatch(PurchaseQuotesActions.GetBrandsAndSeries());
  }

  onLoadSalesAdvisor() {
    this.store.dispatch(PurchaseQuotesActions.GetSalesAdvisor());
  }

  onListSeriesModels(payload: { brand: string; series: string }) {
    this.store.dispatch(PurchaseQuotesActions.GetSeriesModels(payload));
  }

  onListVariants(payload: IModels.IVariant) {
    this.store.dispatch(PurchaseQuotesActions.GetVariants({ payload }));
  }

  onResetUnit() {
    this.store.dispatch(PurchaseQuotesActions.ResetUnit());
  }

  onLoadGlobalBrands(): void {
    this.store.dispatch(PurchaseQuotesActions.GetGlobalBrands());
  }

  onLoadGlobalModels(payload: { brand: string }): void {
    this.store.dispatch(PurchaseQuotesActions.GetGlobalModels({ payload }));
  }

  onLoadGlobalVariants(payload: { brand: string; model: string }): void {
    this.store.dispatch(PurchaseQuotesActions.GetGlobalVariants({ payload }));
  }

  onClearBadge(payload: IPurchases.IUpdateBadge) {
    this.store.dispatch(PurchaseQuotesActions.ClearSaleBadge({ payload }));
  }

  onClearAllBadges(payload: string) {
    this.store.dispatch(PurchaseQuotesActions.ClearAllSaleBadges({ payload }));
  }

  onUploadDocument(
    payload: ISales.IUploadFile
  ): Observable<ITradeIn.IDocument> {
    return this.salesService.uploadSaleDocument(payload);
  }

  onDeleteDocument(
    payload: ISales.IDeleteFile
  ): Observable<ISales.IDeleteFileResponse> {
    return this.salesService.deleteSaleDocument(payload);
  }

  onDownload(payload) {
    return this.purchaseQuoteService.downloadPurchaseQuoteDocument(payload);
  }
}
