import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IReservations } from '../../models';
import { ICorporates } from '@neural/modules/customer/corporate';

// Set Reservation Page
export const SetReservationPage = createAction(
  '[Jobs] Set Reservation Page',
  props<{ payload: IReservations.IConfig }>()
);

// Get Reservation
export const GetReservation = createAction(
  '[Jobs] Get Reservation',
  props<{ payload: string }>()
);
export const GetReservationFail = createAction(
  '[Jobs] Get Reservation Fail',
  props<{ payload: any }>()
);
export const GetReservationSuccess = createAction(
  '[Jobs] Get Reservation Success',
  props<{ payload: IReservations.IDocument }>()
);

// Load Reservation
export const LoadReservations = createAction('[Jobs] Load Reservations');
export const LoadReservationsFail = createAction(
  '[Jobs] Load Reservations Fail',
  props<{ payload: any }>()
);
export const LoadReservationsSuccess = createAction(
  '[Jobs] Load Reservations Success',
  props<{
    reservations: IReservations.IDocument[];
    pagination: IReservations.IPagination;
  }>()
);

// Load Corporate
export const LoadCorporate = createAction(
  '[Customer] Load Corporate In Reservations',
  props<{ payload: string }>()
);
export const LoadCorporateFail = createAction(
  '[Customer] Load Corporate In Reservations Fail',
  props<{ payload: any }>()
);
export const LoadCorporateSuccess = createAction(
  '[Customer] Load Corporate In Reservations Success',
  props<{ payload: ICorporates.IDocument }>()
);

// Branch Change
export const GoToDeclinedList = createAction('[Jobs] Go To Declined List');

// Reset Selected Reservation
export const ResetSelectedReservation = createAction(
  '[Jobs] Reset Selected Reservation'
);

const all = union({
  SetReservationPage,
  GetReservation,
  GetReservationFail,
  GetReservationSuccess,
  LoadReservations,
  LoadReservationsFail,
  LoadReservationsSuccess,
  GoToDeclinedList,
  ResetSelectedReservation,
  LoadCorporate,
  LoadCorporateFail,
  LoadCorporateSuccess
});
export type ReservationsActionsUnion = typeof all;
