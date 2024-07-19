import { createAction, props, union } from '@ngrx/store';

// Models
import { IBranchTeams } from '../../models';

// Load Branch Team
export const ResetBranchTeam = createAction('[Jobs] Reset Branch Team');

export const LoadBranchTeam = createAction('[Jobs] Load Branch Team');
export const LoadBranchTeamFail = createAction(
  '[Jobs] Load Branch Team Fail',
  props<{ payload: any }>()
);
export const LoadBranchTeamSuccess = createAction(
  '[Jobs] Load Branch Team Success',
  props<{ payload: IBranchTeams.IDocument }>()
);

const all = union({
  ResetBranchTeam,
  LoadBranchTeam,
  LoadBranchTeamFail,
  LoadBranchTeamSuccess
});
export type BranchTeamActionsUnion = typeof all;
