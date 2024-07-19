import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromBranchTeams from '../reducer/branch-team.reducer';

export const getBranchTeamsState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.branchTeams
);

export const getBranchTeams = createSelector(
  getBranchTeamsState,
  fromBranchTeams.getBranchTeam
);

export const getBranchTeamsLoaded = createSelector(
  getBranchTeamsState,
  (state: fromBranchTeams.BranchTeamState) => state.loaded
);

export const getBranchTeamsLoading = createSelector(
  getBranchTeamsState,
  (state: fromBranchTeams.BranchTeamState) => state.loading
);

export const getBranchTeamsError = createSelector(
  getBranchTeamsState,
  (state: fromBranchTeams.BranchTeamState) => state.error
);

export const BranchTeamsQuery = {
  getBranchTeamsState,
  getBranchTeams,
  getBranchTeamsLoaded,
  getBranchTeamsLoading,
  getBranchTeamsError
};
