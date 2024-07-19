import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

import { IGroup } from '../../models';

// Load Groups
export const LoadGroups = createAction('[Admin] Load Groups');
export const LoadGroupsFail = createAction(
  '[Admin] Load Groups Fail',
  props<{ payload: any }>()
);
export const LoadGroupsSuccess = createAction(
  '[Admin] Load Groups Success',
  props<{ payload: IGroup.IDocument[] }>()
);

// Create Groups
export const CreateGroup = createAction(
  '[Admin] Create Group Tags',
  props<{ payload: IGroup.IDocument }>()
);
export const CreateGroupFail = createAction(
  '[Admin] Create Group Fail',
  props<{ payload: any }>()
);
export const CreateGroupSuccess = createAction(
  '[Admin] Create Group Success',
  props<{ payload: IGroup.IDocument }>()
);

// Get Group
export const GetGroup = createAction(
  '[Admin] Get Group',
  props<{ payload: string }>()
);
export const GetGroupFail = createAction(
  '[Admin] Get Group Fail',
  props<{ payload: any }>()
);
export const GetGroupSuccess = createAction(
  '[Admin] Get Group Success',
  props<{ payload: IGroup.IDocument }>()
);

// Update Groups
export const UpdateGroup = createAction(
  '[Admin] Update Group',
  props<{ payload: IGroup.IDocument }>()
);
export const UpdateGroupFail = createAction(
  '[Admin] Update Group Fail',
  props<{ payload: any }>()
);
export const UpdateGroupSuccess = createAction(
  '[Admin] Update Group Success',
  props<{ payload: Update<IGroup.IDocument> }>()
);

// Delete Groups
export const DeleteGroup = createAction(
  '[Admin] Delete Group',
  props<{ payload: IGroup.IDocument }>()
);
export const DeleteGroupFail = createAction(
  '[Admin] Delete Group Fail',
  props<{ payload: any }>()
);
export const DeleteGroupSuccess = createAction(
  '[Admin] Delete Group Success',
  props<{ payload: IGroup.IDocument }>()
);

// Filter Available Groups
export const FilterAvailableGroups = createAction(
  '[Admin] Filter Available Groups',
  props<{ payload: string[] }>()
);

// redirect
export const RedirectToGroups = createAction(
  '[Configuration] Redirect To Groups'
);

// Reset Selected Group
export const ResetSelectedGroup = createAction(
  '[Admin] Reset Selected Group'
);

const all = union({
  LoadGroups,
  LoadGroupsFail,
  LoadGroupsSuccess,
  CreateGroup,
  CreateGroupFail,
  CreateGroupSuccess,
  GetGroup,
  GetGroupFail,
  GetGroupSuccess,
  UpdateGroup,
  UpdateGroupFail,
  UpdateGroupSuccess,
  DeleteGroup,
  DeleteGroupFail,
  DeleteGroupSuccess,
  FilterAvailableGroups,
  RedirectToGroups,
  ResetSelectedGroup
});
export type GroupsActionsUnion = typeof all;
