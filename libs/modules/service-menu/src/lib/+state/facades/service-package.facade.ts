import { Injectable, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ServicePackageQuery } from '../selectors';
import { IServiceLine, IServicePackage } from '../../models';
import { IServiceMenuState } from '../reducers';
import { ServicePackageAction } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class ServicePackageFacade {
  servicePackages$ = this.store.select(ServicePackageQuery.getAllServicePackage);
  servicePackage$ = this.store.select(ServicePackageQuery.getSelectedServicePackage);
  getServicePackageConfig$ = this.store.select(
    ServicePackageQuery.getServicePackageConfig
  );
  getServicePackageFilters$ = this.store.select(
    ServicePackageQuery.getServicePackageFilters
  );
  getServicePackageSorts$ = this.store.select(
    ServicePackageQuery.getServicePackageSorts
  );

  total$ = this.store.select(ServicePackageQuery.getServicePackageTotal);
  loading$ = this.store.select(ServicePackageQuery.getServicePackageLoading);
  loaded$ = this.store.select(ServicePackageQuery.getServicePackageLoaded);
  error$ = this.store.select(ServicePackageQuery.getServicePackageError);
  globalBrands$ = this.store.select(ServicePackageQuery.getVehiclesBrands);
  serviceLines$ = this.store.select(ServicePackageQuery.getServicePackagesLines);
  corporate$ = this.store.select(ServicePackageQuery.selectedCorporate);
  branch$ = this.store.select(ServicePackageQuery.selectedBranch);

  constructor(private store: Store<IServiceMenuState>) {}

  getServicePackageList() {
    this.store.dispatch(ServicePackageAction.loadServicePackages());
  }
  resetServicePackagePage() {
    const params: IServiceLine.IConfig = {
      page: 1,
      limit: IServiceLine.Config.LIMIT,
    };
    this.store.dispatch(
      ServicePackageAction.SetServicePackagePage({ payload: params })
    );
  }
  changeServicePackagePage(config: IServiceLine.IConfig) {
    this.store.dispatch(
      ServicePackageAction.ChangeServicePackagePage({ payload: config })
    );
  }
  changeServicePackageFilter(filter: IServiceLine.IFilter) {
    this.store.dispatch(
      ServicePackageAction.SetServicePackageFilters({ payload: filter })
    );
  }
  setFilterFaild() {
    this.store.dispatch(
      ServicePackageAction.loadServicePackagesFailed({
        payload: { status: 404, message: 'No Data Found' },
      })
    );
  }
  create(event: IServicePackage.IDocument) {
    this.store.dispatch(
      ServicePackageAction.CreateServicePackage({ payload: event })
    );
  }
  update(payload: IServicePackage.IDocument) {
    this.store.dispatch(ServicePackageAction.UpdateServicePackage({ payload }));
  }
  getServicePackage(uuid: string) {
    this.store.dispatch(ServicePackageAction.GetServicePackage({ payload: uuid }));
  }
  onRedirect() {
    this.store.dispatch(ServicePackageAction.RedirectToServicePackage());
  }
  onReLoadList() {
    this.store.dispatch(ServicePackageAction.loadServicePackages());
  }
  getBrands() {
    this.store.dispatch(ServicePackageAction.GetBrands());
  }
  getServiceLines() {
    this.store.dispatch(ServicePackageAction.loadServiceLines());
  }
  getCorporate() {
    this.store.dispatch(ServicePackageAction.LoadCorporate());
  }
  changeStatus(payload: IServiceLine.IChangeStatus) {
    this.store.dispatch(ServicePackageAction.ChangeStatusServicePackage({ payload }));
  }
  getBranch(uuid: string) {
    this.store.dispatch(ServicePackageAction.GetBranch({ payload: uuid }));
  }
  resetToggle(account: IServicePackage.IDocument) {
    this.store.dispatch(
      ServicePackageAction.ResetStatus({
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

}
