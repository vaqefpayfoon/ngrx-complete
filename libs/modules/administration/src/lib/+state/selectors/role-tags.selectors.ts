import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromRoleTags from '../reducers/role-tags.reducer';

export const getRoleTagsState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.roleTags
);

export const getRoleTagsPermissions = createSelector(
  getRoleTagsState,
  (state: fromRoleTags.RoleTagsState) => state.permissions
);

export const getRoleTagsSelectedPermissions = createSelector(
  getRoleTagsState,
  (state: fromRoleTags.RoleTagsState) => state.selectedPermissions
);

export const getRoleTagsLoaded = createSelector(
  getRoleTagsState,
  (state: fromRoleTags.RoleTagsState) => state.loaded
);

export const getRoleTagsLoading = createSelector(
  getRoleTagsState,
  (state: fromRoleTags.RoleTagsState) => state.loading
);

export const roleTagsQuery = {
  getRoleTagsState,
  getRoleTagsPermissions,
  getRoleTagsSelectedPermissions,
  getRoleTagsLoaded,
  getRoleTagsLoading
};
