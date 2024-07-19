import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IServicesState } from '../reducer';

// Selector
import { ServicesQuery } from '../selectors';

// Action
import { ServicesActions } from '../actions';

// Models
import { IServices } from '../../models';

@Injectable()
export class ServicesFacade {
  services$ = this.store.select(ServicesQuery.getAllServices);

  filteredService$ = this.store.select(ServicesQuery.getFilteredServices);

  total$ = this.store.select(ServicesQuery.getServicesTotals);

  service$ = this.store.select(ServicesQuery.getSelectedService);

  category$ = this.store.select(ServicesQuery.getSelectedCategory);

  loading$ = this.store.select(ServicesQuery.getServicesLoading);

  loaded$ = this.store.select(ServicesQuery.getServicesLoaded);

  error$ = this.store.select(ServicesQuery.getServicesError);

  constructor(private store: Store<IServicesState>) {}

  toggleStatus(service: IServices.IDocument) {
    if (service.isActive) {
      this.store.dispatch(
        ServicesActions.DeactivateService({ payload: service })
      );
    } else {
      this.store.dispatch(
        ServicesActions.ActivateService({ payload: service })
      );
    }
  }

  resetToggle(service: IServices.IDocument) {
    this.store.dispatch(
      ServicesActions.ResetServiceStatus({
        payload: {
          id: service.uuid,
          changes: {
            isActive: service.isActive,
          },
        },
      })
    );
  }

  create(event: IServices.ICreate) {
    this.store.dispatch(ServicesActions.CreateService({ payload: event }));
  }

  update(event: IServices.IDocument) {
    this.store.dispatch(ServicesActions.UpdateService({ payload: event }));
  }

  select(event: IServices.IDocument) {
    // this.store.dispatch(ServicesActions.SelectedCorporate({ payload: event }));
  }

  selectCategory(event: string) {
    this.store.dispatch(ServicesActions.SelectCategory({ payload: event }));
  }

  onLoad() {
    this.store.dispatch(ServicesActions.LoadServices());
  }

  onResetSelectedService() {
    this.store.dispatch(ServicesActions.ResetSelectedService());
  }

  branchChange() {
    this.store.dispatch(ServicesActions.GoToServicesList());
  }

  selectBranch() {
    this.store.dispatch(ServicesActions.SelectBranch());
  }

  getService(uuid: string) {
    this.store.dispatch(ServicesActions.GetService({ payload: uuid }));
  }
}
