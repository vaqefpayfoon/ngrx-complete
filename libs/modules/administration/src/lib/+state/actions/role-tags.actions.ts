import { createAction, props, union } from '@ngrx/store';

// Load Role Tags
export const LoadRoleTags = createAction('[Admin] Load Role Tags');
export const LoadRoleTagsFail = createAction(
  '[Admin] Load Role Tags Fail',
  props<{ payload: any }>()
);
export const LoadRoleTagsSuccess = createAction(
  '[Admin] Load Role Tags Success',
  props<{ payload: string[] }>()
);

// Visualize Role Tags
export const VisualizeRoleTags = createAction(
  '[Admin] Visualize Role Tags',
  props<{ payload: string[] }>()
);

const all = union({
  LoadRoleTags,
  LoadRoleTagsFail,
  LoadRoleTagsSuccess,
  VisualizeRoleTags
});
export type RoleTagsActionsUnion = typeof all;
