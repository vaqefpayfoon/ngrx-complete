import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IReservations } from '../../models';

// Set Service Center Declined Page
export const SetServiceCenterDeclinedPage = createAction(
  '[Jobs] Set Service Center Declined Page',
  props<{ payload: IReservations.IConfig }>()
);

// Load Services Center Declined
export const LoadServicesCenterDeclined = createAction('[Jobs] Load Services Center Declined');
export const LoadServicesCenterDeclinedsFail = createAction(
  '[Jobs] Load Services Center Declined Fail',
  props<{ payload: any }>()
);
export const LoadServicesCenterDeclinedSuccess = createAction(
  '[Jobs] Load Services Center Declined Success',
  props<{
    reservations: IReservations.IDocument[];
    pagination: IReservations.IPagination;
  }>()
);

// Get Service Center Declined
export const GetServiceCenterDeclined = createAction(
  '[Jobs] Get Service Center Declined',
  props<{ payload: string }>()
);
export const GetServiceCenterDeclinedFail = createAction(
  '[Jobs] Get Service Center Declined Fail',
  props<{ payload: any }>()
);
export const GetServiceCenterDeclinedSuccess = createAction(
  '[Jobs] Get Service Center Declined Success',
  props<{ payload: IReservations.IDocument }>()
);

// Branch Change
export const GoToServicesCenterDeclinedList = createAction('[Jobs] Go To Services Center Declined List');

// Reset Selected Service Center Declined
export const ResetSelectedServiceCenterDeclined = createAction(
  '[Jobs] Reset Selected Service Center Declined'
);

const all = union({
  SetServiceCenterDeclinedPage,
  LoadServicesCenterDeclined,
  LoadServicesCenterDeclinedsFail,
  LoadServicesCenterDeclinedSuccess,
  GetServiceCenterDeclined,
  GetServiceCenterDeclinedFail,
  GetServiceCenterDeclinedSuccess,
  GoToServicesCenterDeclinedList,
  ResetSelectedServiceCenterDeclined
});
export type ServicesCenterDeclinedActionsUnion = typeof all;
