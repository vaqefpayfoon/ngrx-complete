import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromDashboardBasic from './dashboard-basic.reducer';

export interface IDashboardState {
  readonly basic: fromDashboardBasic.IDashboardBasicState;
}

export const REDUCERS: ActionReducerMap<IDashboardState> = {
  basic: fromDashboardBasic.reducer
};

export const getDashboardState = createFeatureSelector<IDashboardState>(
  'dashboard'
);
