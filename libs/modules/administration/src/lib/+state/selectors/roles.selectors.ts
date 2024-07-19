import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromRoles from '../reducers/roles.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IRole } from '../../models';

export const getRolesState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.roles
);

export const getRolesUuids = createSelector(
  getRolesState,
  fromRoles.selectRolesUuids
);

export const getRolesEntities = createSelector(
  getRolesState,
  fromRoles.selectRolesEntities
);

export const getAllRoles = createSelector(
  getRolesState,
  fromRoles.selectAllRoles
);

export const getRolesTotal = createSelector(
  getRolesState,
  fromRoles.selectRolesTotal
);

export const getSelectedRole = createSelector(
  getRolesState,
  (state: fromRoles.RoleState) => state.selectedRole
);

export const getRoleNames = createSelector(
  getRolesEntities,
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

export const getRolesLoaded = createSelector(
  getRolesState,
  (state: fromRoles.RoleState) => state.loaded
);

export const getRolesLoading = createSelector(
  getRolesState,
  (state: fromRoles.RoleState) => state.loading
);

export const getRolesError = createSelector(
  getRolesState,
  (state: fromRoles.RoleState) => state.error
);

export const roleQuery = {
  getRolesState,
  getRolesUuids,
  getRolesEntities,
  getAllRoles,
  getRolesTotal,
  getSelectedRole,
  getRoleNames,
  getRolesLoaded,
  getRolesLoading,
  getRolesError
};
