import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromTestDrives from '../reducers/test-drives.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ITestDrives } from '../../models';

export const getTestDrivesState = createSelector(
  fromFeature.getTestDrivesModuleState,
  (state: fromFeature.ITestDrivesState) => state.testDrives
);

export const getTestDrivesEntities = createSelector(
  getTestDrivesState,
  fromTestDrives.selectTestDrivesEntities
);

export const getTestDrivesUuids = createSelector(
  getTestDrivesState,
  fromTestDrives.selectTestDrivesUuids
);

export const getAllTestDrives = createSelector(
  getTestDrivesState,
  fromTestDrives.selectAllTestDrives
);

export const getTestDrivesTotals = createSelector(
  getTestDrivesState,
  fromTestDrives.selectTestDrivesTotal
);

export const getTestDrivesTotal = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.total
);

export const getTestDrivesConfig = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.pagination
);

export const getTestDrivesPage = createSelector(
  getTestDrivesConfig,
  (pagination): ITestDrives.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSalesAdvisors = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.saleAdvisors
);

export const getTestDriveCalendar = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.testDriveCalendar
);

export const getSelectedTestDrive = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.selectedTestDrive
);

export const getTestDrivesLoaded = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.loaded
);

export const getTestDrivesLoading = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.loading
);

export const getTestDrivesError = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.error
);

export const getTestDrivesSorts = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.sorts
);

export const getTestDrivesBranch = createSelector(
  getTestDrivesState,
  (state: fromTestDrives.TestDrivesState) => state.selectedBranch
);

export const testDrivesQuery = {
  getTestDrivesUuids,
  getTestDrivesEntities,
  getAllTestDrives,
  getTestDrivesTotal,
  getTestDrivesTotals,
  getTestDrivesConfig,
  getTestDrivesPage,
  getSelectedTestDrive,
  getTestDrivesLoaded,
  getTestDrivesLoading,
  getTestDrivesError,
  getSalesAdvisors,
  getTestDriveCalendar,
  getTestDrivesSorts,
  getTestDrivesBranch
};
