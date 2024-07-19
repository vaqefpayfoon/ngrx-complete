import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IReservations, ICalendar } from '../../models';
import { IError } from '@neural/shared/data';

// Set Mobile Service Scheduled Filter
export const SetMobileServiceScheduledFilter = createAction(
  '[Jobs] Set Mobile Service Scheduled Filter',
  props<{ payload: IReservations.IFilter }>()
);

export const SetCompletedPage = createAction(
  '[Jobs] Set Completed Page',
  props<{ payload: IReservations.IConfig }>()
);

// Load Completed Reservation
export const LoadCompletedReservation = createAction(
  '[Jobs] Load Completed Reservation'
);
export const LoadCompletedReservationFail = createAction(
  '[Jobs] Load Completed Reservation Fail',
  props<{ payload: IError }>()
);
export const LoadCompletedReservationSuccess = createAction(
  '[Jobs] Load Completed Reservation Success',
  props<{ payload }>()
);

// Get Completed Reservation
export const GetCompletedReservation = createAction(
  '[Jobs] Get Completed Reservation',
  props<{ payload: string }>()
);
export const GetCompletedReservationFail = createAction(
  '[Jobs] Get Completed Reservation Fail',
  props<{ payload: IError }>()
);
export const GetCompletedReservationSuccess = createAction(
  '[Jobs] Get Completed Reservation Success',
  props<{ payload: IReservations.IDocument }>()
);

// Cancel Reservation
export const CancelReservation = createAction(
  '[Jobs] Cancel Reservation',
  props<{ payload: IReservations.IDocument }>()
);
export const CancelReservationFail = createAction(
  '[Jobs] Cancel Reservation Fail',
  props<{ payload: IError }>()
);
export const CancelReservationSuccess = createAction(
  '[Jobs] Cancel Reservation Success',
  props<{ payload: IReservations.IDocument }>()
);

// Reset Reservation
export const ResetReservation = createAction(
  '[Jobs] Reset Reservation',
  props<{ payload: IReservations.IDocument }>()
);
export const ResetReservationFail = createAction(
  '[Jobs] Reset Reservation Fail',
  props<{ payload: IError }>()
);
export const ResetReservationSuccess = createAction(
  '[Jobs] Reset Reservation Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Complete Reservation
export const CompleteReservation = createAction(
  '[Jobs] Complete Reservation',
  props<{ payload: IReservations.IDocument }>()
);
export const CompleteReservationFail = createAction(
  '[Jobs] Complete Reservation Fail',
  props<{ payload: IError }>()
);
export const CompleteReservationSuccess = createAction(
  '[Jobs] Complete Reservation Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Get Calendar List
export const GetCalendarList = createAction(
  '[Jobs] Get Calendar List',
  props<{ payload: ICalendar.IGetCalendar }>()
);
export const GetCalendarListFail = createAction(
  '[Jobs] Get Calendar List Fail',
  props<{ payload: IError }>()
);
export const GetCalendarListSuccess = createAction(
  '[Jobs] Get Calendar List Success',
  props<{ payload: ICalendar.IDocument[] }>()
);

// Reschedule Mobile Reservation
export const RescheduleMobileReservation = createAction(
  '[Jobs] Reschedule Mobile Reservation',
  props<{ payload: IReservations.IReschedule }>()
);
export const RescheduleMobileReservationFail = createAction(
  '[Jobs] Reschedule Mobile Reservation Fail',
  props<{ payload: IError }>()
);
export const RescheduleMobileReservationSuccess = createAction(
  '[Jobs] Reschedule Mobile Reservation Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Assign Operation Team
export const AssignOperationTeam = createAction(
  '[Jobs] Assign Operation Team',
  props<{
    payload: {
      reservation: IReservations.IDocument;
      assign: IReservations.IAssign;
    };
  }>()
);
export const AssignOperationTeamFail = createAction(
  '[Jobs] Assign Operation Team Fail',
  props<{ payload: IError }>()
);
export const AssignOperationTeamSuccess = createAction(
  '[Jobs] Assign Operation Team Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Increment Date
export const IncrementDate = createAction('[Jobs] Increment Date');

// Decrement Date
export const DecrementDate = createAction('[Jobs] Decrement Date');

// Decrement Date
export const ResetDate = createAction('[Jobs] Decrement Month');

// Change Date
export const ChangeDate = createAction(
  '[Jobs] Change Date',
  props<{ payload: string }>()
);

// Branch Change
export const GoToScheduledList = createAction('[Jobs] Go To Scheduled List');

// Get Reservation Service Report
export const GetReservationServiceReport = createAction(
  '[Jobs] Get Reservation Service Report'
);
export const GetReservationServiceReportFail = createAction(
  '[Jobs] Get Reservation Service Report Fail',
  props<{ payload: any }>()
);
export const GetReservationServiceReportSuccess = createAction(
  '[Jobs] Get Reservation Service Report Success',
  props<{ payload: IReservations.IServicesReport }>()
);

// Get Reservation Amended Report
export const GetReservationAmendedReport = createAction(
  '[Jobs] Get Reservation Amended Report'
);
export const GetReservationAmendedReportFail = createAction(
  '[Jobs] Get Reservation Amended Report Fail',
  props<{ payload: IError }>()
);
export const GetReservationAmendedReportSuccess = createAction(
  '[Jobs] Get Reservation Amended Report Success',
  props<{ payload: IReservations.IAmendedsReport }>()
);

// Get Reservation Job Report
export const GetReservationJobReport = createAction(
  '[Jobs] Get Reservation Job Report'
);
export const GetReservationJobReportFail = createAction(
  '[Jobs] Get Reservation Job Report Fail',
  props<{ payload: IError }>()
);
export const GetReservationJobReportSuccess = createAction(
  '[Jobs] Get Reservation Job Report Success',
  props<{ payload: IReservations.IJobsReport }>()
);

// Reset Mobile Service Calendar
export const ResetMobileServiceCalendar = createAction(
  '[Jobs] Reset Mobile Service Calendar'
);

// redirect
export const RedirectToCompletedReservations = createAction(
  '[Jobs] Redirect To Completed Reservations'
);

// Reset Selected Completed Reservation
export const ResetSelectedCompletedReservation = createAction(
  '[Jobs] Reset Selected Completed Reservation'
);

// Delete Mobile Reservation Success
export const DeleteMobileReservationSuccess = createAction(
  '[Jobs] Delete Mobile Reservation Success',
  props<{ payload: any }>()
);

const all = union({
  SetCompletedPage,
  SetMobileServiceScheduledFilter,
  LoadCompletedReservation,
  LoadCompletedReservationFail,
  LoadCompletedReservationSuccess,
  GetCompletedReservation,
  GetCompletedReservationFail,
  GetCompletedReservationSuccess,
  CancelReservation,
  CancelReservationFail,
  CancelReservationSuccess,
  ResetReservation,
  ResetReservationFail,
  ResetReservationSuccess,
  CompleteReservation,
  CompleteReservationFail,
  CompleteReservationSuccess,
  AssignOperationTeam,
  AssignOperationTeamFail,
  AssignOperationTeamSuccess,
  IncrementDate,
  DecrementDate,
  ResetDate,
  ChangeDate,
  GoToScheduledList,
  GetReservationServiceReport,
  GetReservationServiceReportFail,
  GetReservationServiceReportSuccess,
  GetReservationAmendedReport,
  GetReservationAmendedReportFail,
  GetReservationAmendedReportSuccess,
  GetReservationJobReport,
  GetReservationJobReportFail,
  GetReservationJobReportSuccess,
  RescheduleMobileReservation,
  RescheduleMobileReservationFail,
  RescheduleMobileReservationSuccess,
  GetCalendarList,
  GetCalendarListFail,
  GetCalendarListSuccess,
  ResetMobileServiceCalendar,
  RedirectToCompletedReservations,
  ResetSelectedCompletedReservation
});
export type CompletedsActionsUnion = typeof all;
