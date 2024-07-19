import { createReducer, on } from '@ngrx/store';

import { DashboardBasicActions } from '../actions';

import { IDashboard } from '../../models';

export interface IDashboardBasicState {
  basic: IDashboard.IBasic | null;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const initialState = {
  basic: null,
  loading: false,
  loaded: false,
  error: null
};

const dashboardBasicReducer = createReducer(
  initialState,
  on(DashboardBasicActions.LoadDashboardBasic, state => ({
    ...state,
    basic: null,
    loading: true,
    loaded: false,
    error: null
  })),

  on(DashboardBasicActions.LoadDashboardBasicSuccess, (state, { payload }) => {
    const basic = payload;
    return {
      ...state,
      basic,
      loading: false,
      loaded: true,
      error: null
    };
  }),

  on(DashboardBasicActions.LoadDashboardBasicFail, (state, { payload }) => {
    const error = payload;

    return { ...state, loaded: false, loading: false, error };
  }),

  on(DashboardBasicActions.ResetLoadedDasboardBasic, (state) => {
    return { ...state, loaded: false, loading: false };
  })
);

export function reducer(
  state: IDashboardBasicState | undefined,
  action: DashboardBasicActions.DashboardBasicActionsUnion
) {
  return dashboardBasicReducer(state, action);
}

export const getDashboardBasic = (state: IDashboardBasicState) => state.basic;