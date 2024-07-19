import { Injectable, Injector } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ISalesState } from '../reducers';

// Selector
import { purchaseQuery } from '../selectors';

// Action
import { PurchasesActions } from '../actions';

// Model
import { IPurchases, ISales, ITradeIn } from '../../models';

import { IModels } from '@neural/modules/models';

//Service
import { SalesService } from '../../services/sales.service';
import { Observable } from 'rxjs';

@Injectable()
export class PurchasesFacade {
  loading$ = this.store.select(purchaseQuery.getPurchasesLoading);

  loaded$ = this.store.select(purchaseQuery.getPurchasesLoaded);

  error$ = this.store.select(purchaseQuery.getPurchasesError);

  purchases$ = this.store.select(purchaseQuery.getAllPurchases);

  purchase$ = this.store.select(purchaseQuery.getSelectedPurchase);

  purchasesConfig$ = this.store.select(purchaseQuery.getPurchasesPage);

  getPurchasesFilters$ = this.store.select(purchaseQuery.getPurchasesFilters);

  getPurchasesSorts$ = this.store.select(purchaseQuery.getPurchasesSorts);

  total$ = this.store.select(purchaseQuery.getPurchasesTotal);

  salesAdvisors$ = this.store.select(purchaseQuery.getSalesAdvisor);

  unit$ = this.store.select(purchaseQuery.getUnit);

  globalVehicles$ = this.store.select(purchaseQuery.getGlobalVehicle);

  private _salesService: SalesService;
  public get salesService(): SalesService {
    if (!this._salesService) {
      this._salesService = this.injector.get(SalesService);
    }
    return this._salesService;
  }

  constructor(private store: Store<ISalesState>, private injector: Injector) {}

  changePurchasesPage(config: ISales.IConfig) {
    this.store.dispatch(
      PurchasesActions.ChangePurchasesPage({ payload: config })
    );
  }

  changePurchasesFilter(filter: ISales.IFilter) {
    this.store.dispatch(
      PurchasesActions.SetPurchasesFilters({ payload: filter })
    );
  }

  resetPurchasesPage() {
    const params: ISales.IConfig = {
      page: 1,
      limit: ISales.Config.LIMIT,
    };
    this.store.dispatch(PurchasesActions.SetPurchasesPage({ payload: params }));
  }

  onComplete(payload: IPurchases.IDocument) {
    this.store.dispatch(PurchasesActions.CompletePurchase({ payload }));
  }

  onCancel(payload: IPurchases.IDocument) {
    this.store.dispatch(PurchasesActions.CancelPurchase({ payload }));
  }

  onUpdate(payload: {
    changes: IPurchases.IUpdate;
    sale: IPurchases.IDocument;
  }) {
    this.store.dispatch(PurchasesActions.UpdatePurchase({ payload }));
  }

  onResetSelectedPurchase() {
    this.store.dispatch(PurchasesActions.ResetSelectedPurchases());
  }

  getPurchase(uuid: string) {
    this.store.dispatch(PurchasesActions.GetPurchase({ payload: uuid }));
  }

  onRedirect() {
    this.store.dispatch(PurchasesActions.RedirectToSales());
  }

  getBrandsAndSeries() {
    this.store.dispatch(PurchasesActions.GetBrandsAndSeries());
  }

  onLoadSalesAdvisor() {
    this.store.dispatch(PurchasesActions.GetSalesAdvisor());
  }

  onListSeriesModels(payload: { brand: string; series: string }) {
    this.store.dispatch(PurchasesActions.GetSeriesModels(payload));
  }

  onListVariants(payload: IModels.IVariant) {
    this.store.dispatch(PurchasesActions.GetVariants({ payload }));
  }

  onResetUnit() {
    this.store.dispatch(PurchasesActions.ResetUnit());
  }

  onLoadGlobalBrands(): void {
    this.store.dispatch(PurchasesActions.GetGlobalBrands());
  }

  onLoadGlobalModels(payload: { brand: string }): void {
    this.store.dispatch(PurchasesActions.GetGlobalModels({ payload }));
  }

  onLoadGlobalVariants(payload: { brand: string; model: string }): void {
    this.store.dispatch(PurchasesActions.GetGlobalVariants({ payload }));
  }

  onClearBadge(payload: IPurchases.IUpdateBadge) {
    this.store.dispatch(PurchasesActions.ClearSaleBadge({ payload }));
  }

  onClearAllBadges(payload: string) {
    this.store.dispatch(PurchasesActions.ClearAllSaleBadges({ payload }));
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

  onUpdateFullFillment(payload: {
    uuid: string;
    fullFillment: IPurchases.ISaleFulfillment;
  }): void {
    this.store.dispatch(
      PurchasesActions.UpdatePurchaseFulfillment({
        payload,
      })
    );
  }

  onDownload(payload){
    return this.salesService.downloadSaleDocument(payload)
  }
}
