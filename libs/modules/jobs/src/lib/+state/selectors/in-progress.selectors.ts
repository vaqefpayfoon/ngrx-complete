import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromInProgress from '../reducer/in-progress.reducer';

export const getInProgressState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.inProgress
);

export const getInProgressList = createSelector(
  getInProgressState,
  fromInProgress.getInProgressJobList
);

export const getInProgress = createSelector(
  getInProgressState,
  fromInProgress.getInProgressJob
);

export const getDailyReport = createSelector(
  getInProgressState,
  (state: fromInProgress.InProgressState) => state.dailyReport
);

export const getInProgressLoaded = createSelector(
  getInProgressState,
  (state: fromInProgress.InProgressState) => state.loaded
);

export const getInProgressLoading = createSelector(
  getInProgressState,
  (state: fromInProgress.InProgressState) => state.loading
);

export const getInProgressError = createSelector(
  getInProgressState,
  (state: fromInProgress.InProgressState) => state.error
);

export const getDailyReportError = createSelector(
  getInProgressState,
  (state: fromInProgress.InProgressState) => state.reportError
);

export const inProgressQuery = {
  getInProgressState,
  getInProgress,
  getInProgressLoaded,
  getInProgressLoading,
  getInProgressError,
  getDailyReport,
  getDailyReportError,
  getInProgressList
};
