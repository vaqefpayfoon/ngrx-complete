import { createReducer, on } from '@ngrx/store';

import { BranchTeamActions } from '../actions';

import { IBranchTeams } from '../../models';

export interface BranchTeamState {
  branchTeams: IBranchTeams.IDocument | null;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const initialState = {
  branchTeams: null,
  loading: false,
  loaded: false,
  error: null
};

const branchTeamReducer = createReducer(
  initialState,

  on(BranchTeamActions.LoadBranchTeam, state => {
    return {
      ...state,
      loaded: false,
      loading: true,
      error: null,
      branchTeams: null
    };
  }),

  on(BranchTeamActions.ResetBranchTeam, state => {
    return {
      ...state,
      loaded: false,
      branchTeams: null
    };
  }),

  on(BranchTeamActions.LoadBranchTeamSuccess, (state, { payload }) => {
    const branchTeams = payload;

    return {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      branchTeams
    };
  }),

  on(BranchTeamActions.LoadBranchTeamFail, (state, { payload }) => {
    const error = payload;

    return { ...state, loaded: false, loading: false, error };
  })
);

export function reducer(
  state: BranchTeamState | undefined,
  action: BranchTeamActions.BranchTeamActionsUnion
) {
  return branchTeamReducer(state, action);
}

export const getBranchTeam = (state: BranchTeamState) => state.branchTeams;
