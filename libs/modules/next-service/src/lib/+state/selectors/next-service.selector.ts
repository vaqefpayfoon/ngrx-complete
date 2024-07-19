import { createSelector } from '@ngrx/store';
import * as fromNextServiceReducer from '../reducers/next-service.reducer';
import * as fromFeature from '../reducers';
import { INextService } from '../../models';

export const getNextServiceState = createSelector(
  fromFeature.getNextServiceModuleState,
  (state: fromFeature.INextServiceStateFeature) => state.nextservices
);

export const getNextServiceConfig = createSelector(
    getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state.pagination
);

export const getNextServiceFilters = createSelector(
    getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state.filters
);

export const getNextServiceSorts = createSelector(
    getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state.sorts
);

export const getNextServiceTotal = createSelector(
    getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state.total
);

export const getNextServiceLoaded = createSelector(
    getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state.loaded
);

export const getNextServiceLoading = createSelector(
    getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state.loading
);

export const getNextServiceError = createSelector(
    getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state.error
);

export const getAllNextService = createSelector(
    getNextServiceState,
  fromNextServiceReducer.selectAllNextService
);

export const getNextServiceEntities = createSelector(
    getNextServiceState,
    fromNextServiceReducer.selectNextServiceEntities
);


export const getNextServiceTotals = createSelector(
    getNextServiceState,
    fromNextServiceReducer.selectNextServiceTotal
);

export const getNextServicePage = createSelector(
  getNextServiceConfig,
  (pagination): INextService.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);


export const getSelectedNextService = createSelector(
  getNextServiceState,
  (state: fromNextServiceReducer.INextServiceState) => state
);

export const NextServiceQuery = {
    getNextServiceState,
    getNextServiceConfig,
    getNextServiceFilters,
    getNextServiceSorts,
    getNextServiceTotal,
    getNextServiceLoaded,
    getNextServiceLoading,
    getNextServiceError,
    getAllNextService,
    getNextServiceEntities,
    getNextServiceTotals,
    getNextServicePage,
    getSelectedNextService
};
