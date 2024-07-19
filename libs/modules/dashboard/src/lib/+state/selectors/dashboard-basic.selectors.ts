import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromDashboardBasic from '../reducers/dashboard-basic.reducer';

export const getDashboardBasicState = createSelector(
  fromFeature.getDashboardState,
  (state: fromFeature.IDashboardState) => state.basic
);

export const getBasicAll = createSelector(
  getDashboardBasicState,
  fromDashboardBasic.getDashboardBasic
);

export const getDashboardBasicLoaded = createSelector(
  getDashboardBasicState,
  (state: fromDashboardBasic.IDashboardBasicState) => state.loaded
);

export const getDashboardBasicLoading = createSelector(
  getDashboardBasicState,
  (state: fromDashboardBasic.IDashboardBasicState) => state.loading
);

export const getDashboardBasicError = createSelector(
  getDashboardBasicState,
  (state: fromDashboardBasic.IDashboardBasicState) => state.error
);

export const DashboardBasicQuery = {
  getDashboardBasicState,
  getBasicAll,
  getDashboardBasicLoaded,
  getDashboardBasicLoading,
  getDashboardBasicError
};
