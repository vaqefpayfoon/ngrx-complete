import { createSelector } from '@ngrx/store';
import * as fromServiceLineReducer from '../reducers/service-line.reducer';
import * as fromFeature from '../reducers';
import { IServiceLine } from '../../models';

export const getServiceLineState = createSelector(
  fromFeature.getServiceMenuModuleState,
  (state: fromFeature.IServiceMenuState) => state.serviceLines
);
export const getSelectedServiceLine = createSelector(
    getServiceLineState,
    (state: fromServiceLineReducer.IServiceLineState) => state.selectedServiceLine
  );
export const getServiceLineConfig = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.pagination
);

export const getServiceLineFilters = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.filters
);

export const getServiceLineSorts = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.sorts
);

export const getServiceLineTotal = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.total
);

export const getServiceLineLoaded = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.loaded
);

export const getServiceLineLoading = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.loading
);

export const getServiceLineError = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.error
);
export const getAllServiceLine = createSelector(
  getServiceLineState,
  fromServiceLineReducer.selectAllServiceLineManagements
);

export const getServiceLineEntities = createSelector(
  getServiceLineState,
  fromServiceLineReducer.selectServiceLineManagementsEntities
);

export const getServiceLineUuids = createSelector(
  getServiceLineState,
  fromServiceLineReducer.selectServiceLinesUuids
);

export const getServiceLineTotals = createSelector(
  getServiceLineState,
  fromServiceLineReducer.selectServiceLineManagementsTotal
);

export const getServiceLinePage = createSelector(
  getServiceLineConfig,
  (pagination): IServiceLine.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);
export const getGlobalBrands = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.brands
);
export const getServiceTypelist = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.services
);
export const getSelectedCorporate = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.selectedCorporate
);
export const getSelectedBranch = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.selectedBranch
);
export const getforetellis = createSelector(
  getServiceLineState,
  (state: fromServiceLineReducer.IServiceLineState) => state.fortellis
);
export const ServiceLineQuery = {
  getSelectedServiceLine,
  getServiceLineConfig,
  getServiceLineFilters,
  getServiceLineSorts,
  getServiceLineTotal,
  getServiceLineLoaded,
  getServiceLineLoading,
  getServiceLineError,
  getAllServiceLine,
  getServiceLineEntities,
  getServiceLineUuids,
  getServiceLineTotals,
  getServiceLinePage,
  getGlobalBrands,
  getServiceTypelist,
  getSelectedCorporate,
  getSelectedBranch,
  getServiceLineState,
  getforetellis
};
