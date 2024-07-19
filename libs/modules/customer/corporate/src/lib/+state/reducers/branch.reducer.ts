import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { BranchesActions } from '../actions';

import { IBranches } from '../../models';

export interface BrancheState extends EntityState<IBranches.IDocument> {
  countries: string[];
  selectedCountry: IBranches.IGetCountry;
  selectedBranch: IBranches.IDocument;
  loaded: boolean;
  loading: boolean;
  error: string | null;
  schedulesOffDays: IBranches.IOffDaysList[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
}

export const adapter: EntityAdapter<IBranches.IDocument> = createEntityAdapter<
  IBranches.IDocument
>({
  selectId: (branch) => branch.uuid,
  sortComparer: sortByOrder,
});

export const initialState: BrancheState = adapter.getInitialState({
  countries: null,
  selectedCountry: null,
  selectedBranch: null,
  loading: false,
  loaded: false,
  error: null,
  schedules: null,
  schedulesOffDays: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
});

export function sortByOrder(
  a: IBranches.IDocument,
  b: IBranches.IDocument
): number {
  if (a.order > b.order) return 1;
  if (b.order > a.order) return -1;

  return 0;
}

const roleReducer = createReducer(
  initialState,

  on(BranchesActions.LoadBranches, (state) => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    });
  }),

  on(
    BranchesActions.LoadBranchesFail,
    BranchesActions.CreateBranchFail,
    BranchesActions.UpdateBranchFail,
    BranchesActions.ActivateBranchFail,
    BranchesActions.DeactivateBranchFail,
    BranchesActions.LoadCountryNamesFail,
    BranchesActions.GetCountryFail,
    BranchesActions.GetBranchFail,
    BranchesActions.UpdateSchedularFail,
    BranchesActions.CreateSchedularFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(BranchesActions.LoadBranchesSuccess, (state, { payload }) =>
    adapter.addAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(BranchesActions.CreateBranch, BranchesActions.UpdateBranch, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BranchesActions.CreateBranchSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(BranchesActions.CreateSchedularSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.UpdateSchedularSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.DeleteSchedularSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.DeleteSchedularOffDays, (state, { payload }) => {
    return {
      ...state,
    };
  }),

  on(BranchesActions.DeleteSchedularOffDaysSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.CreateSchedularTeamSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.UpdateSchedularTeamSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.UpdateSchedulesOffDaysSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.CreateSchedulesOffDaysSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.DeleteSchedularTeamSuccess, (state, { payload }) => {
    return {
      ...state,
      selectedBranch: payload,
    };
  }),

  on(BranchesActions.GetBranchSuccess, (state, { payload }) => {
    const selectedBranch = payload;
    return {
      ...state,
      selectedBranch,
      error: null,
    };
  }),

  on(BranchesActions.UpdateBranchSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(BranchesActions.LoadCountryNames, (state) => ({
    ...state,
    loading: true,
    countries: null,
    error: null,
  })),

  on(BranchesActions.LoadCountryNamesSuccess, (state, { payload }) => {
    const countries = payload;

    return {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      countries,
    };
  }),

  on(BranchesActions.GetCountrySuccess, (state, { payload }) => {
    const selectedCountry: IBranches.IGetCountry = {
      codes: payload.codes,
      states: payload.states,
    };

    return {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      selectedCountry,
    };
  }),

  on(BranchesActions.ResetBranch, (state) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    selectedBranch: null,
  })),

  on(BranchesActions.RedirectToTeams, (state) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    selectedBranch: null,
  }))
);

export function reducer(
  state: BrancheState | undefined,
  action: BranchesActions.BranchesActionsUnion
) {
  return roleReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Branches uuids
export const selectBranchesUuids = selectIds;

// select the dictionary of Branches entities
export const selectBranchesEntities = selectEntities;

// select the array of Branches
export const selectAllBranches = selectAll;

// select the total Branches count
export const selectBranchesTotal = selectTotal;
