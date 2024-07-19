import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IDashboardState } from '../reducers';

// Selector
import { DashboardBasicQuery } from '../selectors';

// Action
import { DashboardBasicActions } from '../actions';

// Models
import { IDashboard } from '../../models';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class DashboardBasicFacade {
  basic$ = this.store.select(DashboardBasicQuery.getBasicAll);

  loading$ = this.store.select(DashboardBasicQuery.getDashboardBasicLoading);
  
  loaded$ = this.store.select(DashboardBasicQuery.getDashboardBasicLoaded);

  error$ = this.store.select(DashboardBasicQuery.getDashboardBasicError);
  
  getRouter$ = this.store.select(fromRoot.getRouterState);

  constructor(private store: Store<IDashboardState | fromRoot.State>) {}

  onLoad() {
    this.store.dispatch(DashboardBasicActions.LoadDashboardBasic());
  }
}
