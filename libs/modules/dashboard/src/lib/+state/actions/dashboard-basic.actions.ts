import { createAction, props, union } from '@ngrx/store';
import { IError } from '@neural/shared/data';

// Models
import { IDashboard } from '../../models';

export const LoadDashboardBasic = createAction(
  '[Dashboard] Load DashboardBasic'
);

export const LoadDashboardBasicSuccess = createAction(
  '[Dashboard] Load DashboardBasic Success',
  props<{ payload: IDashboard.IBasic }>()
);

export const LoadDashboardBasicFail = createAction(
  '[Dashboard] Load DashboardBasic Fail',
  props<{ payload: IError }>()
);

export const ResetLoadedDasboardBasic = createAction(
  '[Dashboard] Reset Loaded Dasboard Basic'
);

const all = union({
  LoadDashboardBasic,
  LoadDashboardBasicSuccess,
  LoadDashboardBasicFail,
  ResetLoadedDasboardBasic
});
export type DashboardBasicActionsUnion = typeof all;
