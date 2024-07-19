import { Injectable, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ServiceLineQuery } from '../selectors';
import { IServiceLine } from '../../models';
import { IServiceMenuState } from '../reducers';
import { ServiceLineAction } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class ServiceLineFacade {
  serviceLines$ = this.store.select(ServiceLineQuery.getAllServiceLine);
  serviceLine$ = this.store.select(ServiceLineQuery.getSelectedServiceLine);
  getServiceLineConfig$ = this.store.select(
    ServiceLineQuery.getServiceLineConfig
  );
  getServiceLineFilters$ = this.store.select(
    ServiceLineQuery.getServiceLineFilters
  );
  getServiceLineSorts$ = this.store.select(
    ServiceLineQuery.getServiceLineSorts
  );

  total$ = this.store.select(ServiceLineQuery.getServiceLineTotal);
  loading$ = this.store.select(ServiceLineQuery.getServiceLineLoading);
  loaded$ = this.store.select(ServiceLineQuery.getServiceLineLoaded);
  error$ = this.store.select(ServiceLineQuery.getServiceLineError);
  globalBrands$ = this.store.select(ServiceLineQuery.getGlobalBrands);
  serviceTypelist$ = this.store.select(ServiceLineQuery.getServiceTypelist);
  corporate$ = this.store.select(ServiceLineQuery.getSelectedCorporate);
  branch$ = this.store.select(ServiceLineQuery.getSelectedBranch);
  fortellis$ = this.store.select(ServiceLineQuery.getforetellis);

  constructor(private store: Store<IServiceMenuState>) {}

  getServiceLineList() {
    this.store.dispatch(ServiceLineAction.loadServiceLines());
  }
  resetServiceLinePage() {
    const params: IServiceLine.IConfig = {
      page: 1,
      limit: IServiceLine.Config.LIMIT,
    };
    this.store.dispatch(
      ServiceLineAction.SetServiceLinePage({ payload: params })
    );
  }
  changeServiceLinePage(config: IServiceLine.IConfig) {
    this.store.dispatch(
      ServiceLineAction.ChangeServiceLinePage({ payload: config })
    );
  }
  changeServiceLineFilter(filter: IServiceLine.IFilter) {
    this.store.dispatch(
      ServiceLineAction.SetServiceLineFilters({ payload: filter })
    );
  }
  setFilterFaild() {
    this.store.dispatch(
      ServiceLineAction.loadServiceLinesFailed({
        payload: { status: 404, message: 'No Data Found' },
      })
    );
  }
  create(event: IServiceLine.IDocument) {
    this.store.dispatch(
      ServiceLineAction.CreateServiceLine({ payload: event })
    );
  }
  update(payload: IServiceLine.IDocument) {
    this.store.dispatch(ServiceLineAction.UpdateServiceLine({ payload }));
  }
  getServiceLine(uuid: string) {
    this.store.dispatch(ServiceLineAction.GetServiceLine({ payload: uuid }));
  }
  onRedirect() {
    this.store.dispatch(ServiceLineAction.RedirectToServiceLine());
  }
  onReLoadList() {
    this.store.dispatch(ServiceLineAction.loadServiceLines());
  }
  getServiceTypes() {
    this.store.dispatch(ServiceLineAction.GetServiceTypes());
  }
  getFortellis(payload: IServiceLine.IParams) {
    this.store.dispatch(ServiceLineAction.GetFortellis({ payload }));
  }
  getBrands() {
    this.store.dispatch(ServiceLineAction.GetBrands());
  }
  getCorporate() {
    this.store.dispatch(ServiceLineAction.LoadCorporate());
  }
  changeStatus(payload: IServiceLine.IChangeStatus) {
    this.store.dispatch(ServiceLineAction.ChangeStatusServiceLine({ payload }));
  }
  getBranch(uuid: string) {
    this.store.dispatch(ServiceLineAction.GetBranch({ payload: uuid }));
  }
  resetToggle(account: IServiceLine.IDocument) {
    this.store.dispatch(
      ServiceLineAction.ResetStatus({
        payload: {
          id: account.uuid,
          changes: {
            active: account.active,
            isInCustomerApp: account.isInCustomerApp,
          },
        },
      })
    );
  }

  syncServiceLineDMS() {
    this.store.dispatch(ServiceLineAction.SyncServiceLineDMS());
  }
}
