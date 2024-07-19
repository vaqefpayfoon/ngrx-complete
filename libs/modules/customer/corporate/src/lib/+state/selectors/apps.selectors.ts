import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromApps from '../reducers/apps.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IApps } from '../../models';

export const getAppsState = createSelector(
  fromFeature.getCorporateState,
  (state: fromFeature.ICorporateState) => state.apps
);

export const getAppsEntities = createSelector(
  getAppsState,
  fromApps.selectAppsEntities
);

export const getAllApps = createSelector(
  getAppsState,
  fromApps.selectAllApps
);

export const getSelectedApp = createSelector(
  getAppsState,
  (state: fromApps.AppsState) => state.selectedApp
);

export const getCorporateAppsConfig = createSelector(
  getAppsState,
  (state: fromApps.AppsState) => {
    const { corporateUuid } = state;
    return {
      corporateUuid
    };
  }
);

export const getAppsTotals = createSelector(
  getAppsState,
  fromApps.selectAppsTotal
);

export const getAppToken = createSelector(
  getAppsState,
  (state: fromApps.AppsState) => state.token
);

export const getAppsLoaded = createSelector(
  getAppsState,
  (state: fromApps.AppsState) => state.loaded
);

export const getAppsLoading = createSelector(
  getAppsState,
  (state: fromApps.AppsState) => state.loading
);

export const getAppsError = createSelector(
  getAppsState,
  (state: fromApps.AppsState) => state.error
);

export const AppsQuery = {
  getAppsState,
  getAppsEntities,
  getAllApps,
  getSelectedApp,
  getCorporateAppsConfig,
  getAppsTotals,
  getAppsLoaded,
  getAppsLoading,
  getAppsError,
  getAppToken
};
