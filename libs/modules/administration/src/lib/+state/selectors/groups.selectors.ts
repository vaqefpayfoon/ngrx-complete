import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromGroups from '../reducers/groups.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IGroup } from '../../models';

export const getGroupsState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.groups
);

export const selectVehiclesUuids = createSelector(
  getGroupsState,
  fromGroups.selectGroupsUuids
);

export const getGroupsEntities = createSelector(
  getGroupsState,
  fromGroups.selectGroupsEntities
);

export const getAllGroups = createSelector(
  getGroupsState,
  fromGroups.selectAllGroups
);

export const getGroupsTotal = createSelector(
  getGroupsState,
  fromGroups.selectGroupsTotal
);

export const getSelectedGroup = createSelector(
  getGroupsState,
  (state: fromGroups.GroupState) => state.selectedGroup
);

export const getGroupNames = createSelector(
  getGroupsEntities,
  entities =>
    entities
      ? Object.keys(entities).map(uuid => {
          return {
            uuid: entities[uuid].uuid,
            name: entities[uuid].name
          };
        })
      : null
);

export const getGroupsLoaded = createSelector(
  getGroupsState,
  (state: fromGroups.GroupState) => state.loaded
);

export const getGroupsLoading = createSelector(
  getGroupsState,
  (state: fromGroups.GroupState) => state.loading
);

export const getGroupsError = createSelector(
  getGroupsState,
  (state: fromGroups.GroupState) => state.error
);

export const groupsQuery = {
  getGroupsState,
  getGroupsEntities,
  getSelectedGroup,
  getAllGroups,
  getGroupsTotal,
  getGroupNames,
  getGroupsLoaded,
  getGroupsLoading,
  getGroupsError
};
