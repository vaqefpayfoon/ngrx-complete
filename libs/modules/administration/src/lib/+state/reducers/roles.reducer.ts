import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { RolesActions } from '../actions';

import { IRole } from '../../models';

export interface RoleState extends EntityState<IRole.IDocument> {
  selectedRole: IRole.IDocument;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<IRole.IDocument> = createEntityAdapter<
  IRole.IDocument
>({
  selectId: role => role.uuid,
  sortComparer: sortByName
});

export const initialState: RoleState = adapter.getInitialState({
  selectedRole: null,
  loading: false,
  loaded: false,
  error: null
});

export function sortByName(a: IRole.IDocument, b: IRole.IDocument): number {
  return a.name.localeCompare(b.name);
}

const roleReducer = createReducer(
  initialState,

  on(RolesActions.LoadRoles, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(RolesActions.CreateRole, RolesActions.UpdateRole, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(RolesActions.LoadRolesSuccess, (state, { payload }) =>
    adapter.addAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(RolesActions.CreateRoleSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(RolesActions.GetRoleSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedRole: payload,
      error: null,
    })
  ),

  on(RolesActions.UpdateRoleSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(RolesActions.DeleteRoleSuccess, (state, { payload }) =>
    adapter.removeOne(payload.uuid, {
      ...state,
      error: null
    })
  ),

  on(RolesActions.ResetSelectedRole, (state) => {
    return {
      ...state,
      selectedRole: null,
    };
  }),

  on(
    RolesActions.LoadRolesFail,
    RolesActions.CreateRoleFail,
    RolesActions.UpdateRoleFail,
    RolesActions.DeleteRoleFail,
    RolesActions.GetRoleFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  )
);

export function reducer(
  state: RoleState | undefined,
  action: RolesActions.RolesActionsUnion
) {
  return roleReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Roles uuids
export const selectRolesUuids = selectIds;

// select the dictionary of Roles entities
export const selectRolesEntities = selectEntities;

// select the array of Roles
export const selectAllRoles = selectAll;

// select the total Roles count
export const selectRolesTotal = selectTotal;
