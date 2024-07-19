import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { GroupsActions } from '../actions';

import { IGroup } from '../../models';

export interface GroupState extends EntityState<IGroup.IDocument> {
  selectedGroup: IGroup.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IGroup.IDocument> = createEntityAdapter<
  IGroup.IDocument
>({
  selectId: group => group.uuid,
  sortComparer: sortByName
});

export const initialState: GroupState = adapter.getInitialState({
  selectedGroup: null,
  loaded: false,
  loading: false,
  error: null
});

export function sortByName(a: IGroup.IDocument, b: IGroup.IDocument): number {
  return a.name.localeCompare(b.name);
}

const groupsReducer = createReducer(
  initialState,

  on(GroupsActions.LoadGroups, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(GroupsActions.UpdateGroup, GroupsActions.CreateGroup, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(
    GroupsActions.LoadGroupsFail,
    GroupsActions.CreateGroupFail,
    GroupsActions.UpdateGroupFail,
    GroupsActions.DeleteGroupFail,
    GroupsActions.GetGroupFail,
    (state, { payload }) => {
      const error = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        error
      };
    }
  ),

  on(GroupsActions.GetGroupSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedGroup: payload,
      error: null,
    })
  ),

  on(GroupsActions.LoadGroupsSuccess, (state, { payload }) =>
    adapter.addAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(GroupsActions.CreateGroupSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(GroupsActions.UpdateGroupSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(GroupsActions.DeleteGroupSuccess, (state, { payload }) =>
    adapter.removeOne(payload.uuid, {
      ...state,
      error: null
    })
  ),

  on(GroupsActions.ResetSelectedGroup, (state) => {
    return {
      ...state,
      selectedGroup: null,
    };
  }),
);

export function reducer(
  state: GroupState | undefined,
  action: GroupsActions.GroupsActionsUnion
) {
  return groupsReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Groups uuids
export const selectGroupsUuids = selectIds;

// select the dictionary of Groups entities
export const selectGroupsEntities = selectEntities;

// select the array of Groups
export const selectAllGroups = selectAll;

// select the total Groups count
export const selectGroupsTotal = selectTotal;
