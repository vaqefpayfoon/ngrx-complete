import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromBranches from '../reducers/branch.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IBranches } from '../../models';

export const getBranchesState = createSelector(
  fromFeature.getCorporateState,
  (state: fromFeature.ICorporateState) => state.branches
);

export const getBranchesEntities = createSelector(
  getBranchesState,
  fromBranches.selectBranchesEntities
);

export const getAllBranches = createSelector(
  getBranchesState,
  fromBranches.selectAllBranches
);

export const getSelectedBranch = createSelector(
  getBranchesState,
  (state: fromBranches.BrancheState) => state.selectedBranch
);

export const getAllCountryNames = createSelector(
  getBranchesState,
  (state: fromBranches.BrancheState) => state.countries
);

export const getSchedulesOffDays = createSelector(
  getBranchesState,
  (state: fromBranches.BrancheState) => state.schedulesOffDays
);

export const getCountrySelected = createSelector(
  getBranchesState,
  (state: fromBranches.BrancheState) => state.selectedCountry
);

export const getBranchesTotals = createSelector(
  getBranchesState,
  fromBranches.selectBranchesTotal
);

export const getBranchesLoaded = createSelector(
  getBranchesState,
  (state: fromBranches.BrancheState) => state.loaded
);

export const getBranchesLoading = createSelector(
  getBranchesState,
  (state: fromBranches.BrancheState) => state.loading
);

export const getBranchesError = createSelector(
  getBranchesState,
  (state: fromBranches.BrancheState) => state.error
);

export const branchesQuery = {
  getBranchesState,
  getBranchesEntities,
  getAllBranches,
  getAllCountryNames,
  getCountrySelected,
  getBranchesTotals,
  getBranchesLoaded,
  getBranchesLoading,
  getBranchesError,
  getSelectedBranch,
  getSchedulesOffDays
};
