import { createSelector } from '@ngrx/store';
import * as fromLeadReducer from '../reducers/lead.reducer';
import * as fromFeature from '../reducers';
import { ILead } from '../../models';

export const getLeadManagementsState = createSelector(
  fromFeature.getLeadManagementsModuleState,
  (state: fromFeature.ILeadState) => state.leads
);

export const getLeadManagementConfig = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.pagination
);

export const getLeadManagementFilters = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.filters
);

export const getLeadManagementSorts = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.sorts
);

export const getLeadManagementTotal = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.total
);

export const getLeadManagementLoaded = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.loaded
);

export const getLeadManagementLoading = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.loading
);

export const getLeadManagementError = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.error
);
export const getAllLeadManagements = createSelector(
  getLeadManagementsState,
  fromLeadReducer.selectAllLeadManagements
);

export const getLeadManagementsEntities = createSelector(
  getLeadManagementsState,
  fromLeadReducer.selectLeadManagementsEntities
);

export const getLeadManagementUuids = createSelector(
  getLeadManagementsState,
  fromLeadReducer.selectLeadManagementsUuids
);

export const getLeadManagementTotals = createSelector(
  getLeadManagementsState,
  fromLeadReducer.selectLeadManagementsTotal
);

export const getLeadManagementPage = createSelector(
  getLeadManagementConfig,
  (pagination): ILead.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getLeadManagementSalesAdvisor = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.salesAdvisor
);

export const getSelectedLeadManagement = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.selectedLead
);
export const getSelectedWishList = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.wishLists
);
export const getSelectedPurchaseQuotes = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.purchaseQuotes
);
export const getSelectedTestDrives = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.testDrives
);
export const getSalesAdvisor = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.salesAdvisor
);
export const getGlobalBrands = createSelector(
  getLeadManagementsState,
  (state: fromLeadReducer.ILeadManagementsState) => state.brands
);
export const LeadQuery = {
  getLeadManagementsState,
  getLeadManagementConfig,
  getLeadManagementFilters,
  getLeadManagementSorts,
  getLeadManagementTotal,
  getLeadManagementLoaded,
  getLeadManagementLoading,
  getLeadManagementError,
  getAllLeadManagements,
  getLeadManagementsEntities,
  getLeadManagementUuids,
  getLeadManagementTotals,
  getLeadManagementPage,
  getLeadManagementSalesAdvisor,
  getSelectedLeadManagement,
  getSalesAdvisor,
  getSelectedWishList,
  getSelectedPurchaseQuotes,
  getGlobalBrands,
  getSelectedTestDrives
};
