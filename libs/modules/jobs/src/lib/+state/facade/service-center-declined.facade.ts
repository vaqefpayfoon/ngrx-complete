import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IReservationsState } from '../reducer';

// Selector
import { serviceCenterDeclinedQuery } from '../selectors';

// Action
import { ServiceCenterDeclinedActions } from '../actions';

// Models
import { IReservations } from '../../models';

@Injectable()
export class ServiceCenterDeclinedFacade {
  reservations$ = this.store.select(
    serviceCenterDeclinedQuery.getAllServiceCenterDeclined
  );

  total$ = this.store.select(
    serviceCenterDeclinedQuery.getServiceCenterDeclinedTotal
  );

  reservationsConfig$ = this.store.select(
    serviceCenterDeclinedQuery.getServiceCenterDeclinedPage
  );

  reservation$ = this.store.select(
    serviceCenterDeclinedQuery.getSelectedServiceCenterDeclined
  );

  loading$ = this.store.select(
    serviceCenterDeclinedQuery.getServiceCenterDeclinedLoading
  );

  loaded$ = this.store.select(
    serviceCenterDeclinedQuery.getServiceCenterDeclinedLoaded
  );

  error$ = this.store.select(
    serviceCenterDeclinedQuery.getServiceCenterDeclinedError
  );

  constructor(private store: Store<IReservationsState>) {}

  setResevationPage(config: IReservations.IConfig) {
    this.store.dispatch(
      ServiceCenterDeclinedActions.SetServiceCenterDeclinedPage({
        payload: config,
      })
    );
  }

  branchChange() {
    this.store.dispatch(
      ServiceCenterDeclinedActions.GoToServicesCenterDeclinedList()
    );
  }

  onResetSelectedServiceCenterDeclined() {
    this.store.dispatch(
      ServiceCenterDeclinedActions.ResetSelectedServiceCenterDeclined()
    );
  }

  getServiceCenterDeclined(uuid: string) {
    this.store.dispatch(
      ServiceCenterDeclinedActions.GetServiceCenterDeclined({ payload: uuid })
    );
  }
}
