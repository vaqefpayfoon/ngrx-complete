import { createSelector } from '@ngrx/store';
import * as fromOffDaysReducer from '../reducers/off-days.reducer';
import * as fromFeature from '../reducers';
import { IBranches } from '../../models';

export const getOffDaysState = createSelector(
  fromFeature.getCorporateState,
  (state: fromFeature.ICorporateState) => state.offDays
);

export const getOffDaysTotal = createSelector(
  getOffDaysState,
  (state: fromOffDaysReducer.IOffDaysState) => state.total
);

export const getOffDaysLoaded = createSelector(
  getOffDaysState,
  (state: fromOffDaysReducer.IOffDaysState) => state.loaded
);

export const getOffDaysLoading = createSelector(
  getOffDaysState,
  (state: fromOffDaysReducer.IOffDaysState) => state.loading
);

export const getOffDaysError = createSelector(
  getOffDaysState,
  (state: fromOffDaysReducer.IOffDaysState) => state.error
);

export const getAllOffDays = createSelector(
  getOffDaysState,
  fromOffDaysReducer.selectAllOffDays
);

export const getOffDaysEntities = createSelector(
  getOffDaysState,
  fromOffDaysReducer.selectOffDaysEntities
);

export const getgetOffDaysUuids = createSelector(
  getOffDaysState,
  fromOffDaysReducer.selectOffDaysUuids
);

export const getOffDaysTotals = createSelector(
  getOffDaysState,
  fromOffDaysReducer.selectOffDaysTotal
);

export const getOffDaysConfig = createSelector(
  getOffDaysState,
  (state: fromOffDaysReducer.IOffDaysState) => state.pagination
);

export const getOffDaysPage = createSelector(
  getOffDaysConfig,
  (pagination): IBranches.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const OffDaysQuery = {
    getOffDaysState,
    getOffDaysTotal,
    getOffDaysLoaded,
    getOffDaysLoading,
    getOffDaysError,
    getAllOffDays,
    getOffDaysEntities,
    getgetOffDaysUuids,
    getOffDaysTotals,
    getOffDaysConfig,
    getOffDaysPage
};
