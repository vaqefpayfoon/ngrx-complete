import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IRole } from '../../models';

// Load Roles
export const LoadRoles = createAction('[Admin] Load Roles');
export const LoadRolesFail = createAction(
  '[Admin] Load Roles Fail',
  props<{ payload: any }>()
);
export const LoadRolesSuccess = createAction(
  '[Admin] Load Roles Success',
  props<{ payload: IRole.IDocument[] }>()
);

// Create Role
export const CreateRole = createAction(
  '[Admin] Create Role',
  props<{ payload: IRole.IDocument }>()
);
export const CreateRoleFail = createAction(
  '[Admin] Create Role Fail',
  props<{ payload: any }>()
);
export const CreateRoleSuccess = createAction(
  '[Admin] Create Role Success',
  props<{ payload: IRole.IDocument }>()
);

// Get Role
export const GetRole = createAction(
  '[Admin] Get Role',
  props<{ payload: string }>()
);
export const GetRoleFail = createAction(
  '[Admin] Get Role Fail',
  props<{ payload: any }>()
);
export const GetRoleSuccess = createAction(
  '[Admin] Get Role Success',
  props<{ payload: IRole.IDocument }>()
);

// Update Role
export const UpdateRole = createAction(
  '[Admin] Update Role',
  props<{ payload: IRole.IDocument }>()
);
export const UpdateRoleFail = createAction(
  '[Admin] Update Role Fail',
  props<{ payload: any }>()
);
export const UpdateRoleSuccess = createAction(
  '[Admin] Update Role Success',
  props<{ payload: Update<IRole.IDocument> }>()
);

// Delete Role
export const DeleteRole = createAction(
  '[Admin] Delete Role',
  props<{ payload: IRole.IDocument }>()
);
export const DeleteRoleFail = createAction(
  '[Admin] Delete Role Fail',
  props<{ payload: any }>()
);
export const DeleteRoleSuccess = createAction(
  '[Admin] Delete Role Success',
  props<{ payload: IRole.IDocument }>()
);

// Filter Available Roles
export const FilterAvailableRoles = createAction(
  '[Admin] Filter Available Roles',
  props<{ payload: string[] }>()
);

// redirect
export const RedirectToRoles = createAction(
  '[Configuration] Redirect To Roles'
);

// Reset Selected Role
export const ResetSelectedRole = createAction(
  '[Admin] Reset Selected Role'
);

const all = union({
  LoadRoles,
  LoadRolesFail,
  LoadRolesSuccess,
  CreateRole,
  CreateRoleFail,
  CreateRoleSuccess,
  GetRole,
  GetRoleFail,
  GetRoleSuccess,
  UpdateRole,
  UpdateRoleFail,
  UpdateRoleSuccess,
  DeleteRole,
  DeleteRoleFail,
  DeleteRoleSuccess,
  FilterAvailableRoles,
  RedirectToRoles,
  ResetSelectedRole
});
export type RolesActionsUnion = typeof all;
