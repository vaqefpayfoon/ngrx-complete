import { createAction, props, union } from '@ngrx/store';
import { IBranches } from '../../models';

// Offdays List
export const loadOffDaysList = createAction(
  '[Customer] Get loadOffDaysList',
  props<{ payload: string }>()
);

export const loadOffDaysListSuccess = createAction(
  '[Customer] Get loadOffDaysList success',
  props<{
    payload: IBranches.IOffDaysList[];
    pagination: IBranches.IPagination;
  }>()
);

export const loadOffDaysListFailed = createAction(
  '[Customer] Get loadOffDaysList failed',
  props<{ payload: any }>()
);

export const SetOffDaysListPage = createAction(
  '[Hub] Set OffDaysList Page',
  props<{ uuid: string; payload: IBranches.IConfig }>()
);
export const ChangeOffDaysListPage = createAction(
  '[Hub] Change OffDaysList Page',
  props<{ uuid: string; payload: IBranches.IConfig }>()
);

const all = union({
  loadOffDaysList,
  loadOffDaysListSuccess,
  loadOffDaysListFailed,
  SetOffDaysListPage,
  ChangeOffDaysListPage,
});
export type OffDaysActionsUnion = typeof all;
