import { createReducer, on } from '@ngrx/store';

import { RoleTagsActions } from '../actions';

export interface RoleTagsState {
  permissions: string[];
  loaded: boolean;
  loading: boolean;
  selectedPermissions: string[];
}

export const initialState = {
  permissions: [],
  loaded: false,
  loading: false,
  selectedPermissions: []
};

const roleTagsReducer = createReducer(
  initialState,

  on(RoleTagsActions.LoadRoleTags, state => ({
    ...state,
    loading: true
  })),

  on(RoleTagsActions.LoadRoleTagsSuccess, (state, { payload }) => {
    const permissions = payload;

    return {
      ...state,
      loaded: true,
      loading: false,
      permissions
    };
  }),

  on(RoleTagsActions.VisualizeRoleTags, (state, { payload }) => {
    const selectedPermissions = payload;

    return {
      ...state,
      selectedPermissions
    };
  }),

  on(RoleTagsActions.LoadRoleTagsFail, state => {
    return {
      ...state,
      loading: false,
      loaded: false
    };
  })
);

export function reducer(
  state: RoleTagsState | undefined,
  action: RoleTagsActions.RoleTagsActionsUnion
) {
  return roleTagsReducer(state, action);
}
