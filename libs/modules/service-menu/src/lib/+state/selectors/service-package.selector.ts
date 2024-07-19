import { createSelector } from '@ngrx/store';
import * as fromServicePackageReducer from '../reducers/service-package.reducer';
import * as fromFeature from '../reducers';
import { IServiceLine, IServicePackage } from '../../models';

export const getServicePackageState = createSelector(
  fromFeature.getServiceMenuModuleState,
  (state: fromFeature.IServiceMenuState) => state.servicePackages
);
export const getSelectedServicePackage = createSelector(
    getServicePackageState,
    (state: fromServicePackageReducer.IServicePackageState) => state.selectedServicePackage
  );
export const getServicePackageConfig = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.pagination
);

export const getServicePackageFilters = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.filters
);

export const getServicePackageSorts = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.sorts
);

export const getServicePackageTotal = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.total
);

export const getServicePackageLoaded = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.loaded
);

export const getServicePackageLoading = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.loading
);

export const getServicePackageError = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.error
);
export const getAllServicePackage = createSelector(
  getServicePackageState,
  fromServicePackageReducer.selectAllServicePackageManagements
);

export const getServicePackageEntities = createSelector(
  getServicePackageState,
  fromServicePackageReducer.selectServicePackageManagementsEntities
);

export const getServicePackageUuids = createSelector(
  getServicePackageState,
  fromServicePackageReducer.selectServicePackagesUuids
);

export const getServicePackageTotals = createSelector(
  getServicePackageState,
  fromServicePackageReducer.selectServicePackageManagementsTotal
);

export const getServicePackagePage = createSelector(
  getServicePackageConfig,
  (pagination): IServiceLine.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getVehiclesBrands = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.brands
);
export const getServicePackagesLines = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.serviceLines
);
export const selectedCorporate = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.selectedCorporate
);
export const selectedBranch = createSelector(
  getServicePackageState,
  (state: fromServicePackageReducer.IServicePackageState) => state.selectedBranch
);

export const ServicePackageQuery = {
  getSelectedServicePackage,
  getServicePackageConfig,
  getServicePackageFilters,
  getServicePackageSorts,
  getServicePackageTotal,
  getServicePackageLoaded,
  getServicePackageLoading,
  getServicePackageError,
  getServicePackagePage,
  getVehiclesBrands,
  getServicePackagesLines,
  selectedCorporate,
  selectedBranch,
  getAllServicePackage,
  getServicePackageEntities,
  getServicePackageUuids,
  getServicePackageTotals
};
