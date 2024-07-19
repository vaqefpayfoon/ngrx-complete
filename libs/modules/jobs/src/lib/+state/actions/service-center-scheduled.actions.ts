import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IReservations, ICalendar } from '../../models';

// Set Service Center Scheduled Page
export const SetServiceCenterScheduledPage = createAction(
  '[Jobs] Set Service Center Scheduled Page',
  props<{ payload: IReservations.IConfig }>()
);

// Set Service Center Scheduled Filter
export const SetServiceCenterScheduledFilter = createAction(
  '[Jobs] Set Service Center Scheduled Filter',
  props<{ payload: IReservations.IFilter }>()
);

// Load Service Center Scheduled
export const LoadServiceCenterScheduled = createAction(
  '[Jobs] Load Service Center Scheduled'
);
export const LoadServiceCenterScheduledFail = createAction(
  '[Jobs] Load Service Center Scheduled Fail',
  props<{ payload: any }>()
);
export const LoadServiceCenterScheduledSuccess = createAction(
  '[Jobs] Load Service Center Scheduled Success',
  props<{ payload }>()
);

// Get Service Center Scheduled
export const GetServiceCenterScheduled = createAction(
  '[Jobs] Get Service Center Scheduled',
  props<{ payload: string }>()
);
export const GetServiceCenterScheduledFail = createAction(
  '[Jobs] Get Service Center Scheduled Fail',
  props<{ payload: any }>()
);
export const GetServiceCenterScheduledSuccess = createAction(
  '[Jobs] Get Service Center Scheduled Success',
  props<{ payload}>()
);

// Cancel Service Center Scheduled
export const CancelServiceCenterScheduled = createAction(
  '[Jobs] Cancel Service Center Scheduled',
  props<{ payload: IReservations.IDocument }>()
);
export const CancelServiceCenterScheduledFail = createAction(
  '[Jobs] Cancel Service Center Scheduled Fail',
  props<{ payload: any }>()
);
export const CancelServiceCenterScheduledSuccess = createAction(
  '[Jobs] Cancel Service Center Scheduled Success',
  props<{ payload: IReservations.IDocument }>()
);

// Complete Service Center Scheduled
export const CompleteServiceCenterScheduled = createAction(
  '[Jobs] Complete Service Center Scheduled',
  props<{ payload: IReservations.IDocument }>()
);
export const CompleteServiceCenterScheduledFail = createAction(
  '[Jobs] Complete Service Center Scheduled Fail',
  props<{ payload: any }>()
);
export const CompleteServiceCenterScheduledSuccess = createAction(
  '[Jobs] Complete Service Center Scheduled Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Get Service Center Calendar List
export const GetServiceCenterCalendarList = createAction(
  '[Jobs] Get Service Center Calendar List',
  props<{ payload: ICalendar.IGetCalendar }>()
);
export const GetServiceCenterCalendarListFail = createAction(
  '[Jobs] Get Service Center Calendar List Fail',
  props<{ payload: any }>()
);
export const GetServiceCenterCalendarListSuccess = createAction(
  '[Jobs] Get Service Center Calendar List Success',
  props<{ payload: ICalendar.IDocument[] }>()
);

// Reschedule Service Center Reservation
export const RescheduleServiceCenterReservation = createAction(
  '[Jobs] Reschedule Service Center Reservation',
  props<{ payload: IReservations.IReschedule }>()
);
export const RescheduleServiceCenterReservationFail = createAction(
  '[Jobs] Reschedule Service Center Reservation Fail',
  props<{ payload: any }>()
);
export const RescheduleServiceCenterReservationSuccess = createAction(
  '[Jobs] Reschedule Service Center Reservation Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Increment Date
export const IncrementDate = createAction(
  '[Jobs] Service Center Scheduled Increment Date'
);

// Decrement Date
export const DecrementDate = createAction(
  '[Jobs] Service Center Scheduled Decrement Date'
);

// Decrement Date
export const ResetDate = createAction(
  '[Jobs] Service Center Scheduled Decrement Month'
);

// Change Date
export const ChangeDate = createAction(
  '[Jobs] Change Service Center Scheduled Date',
  props<{ payload: string }>()
);

// Branch Change
export const GoToServiceCenterScheduledList = createAction(
  '[Jobs] Go To Service Center Scheduled List'
);

// Get Service Center Scheduled Report
export const GetServiceCenterScheduledReport = createAction(
  '[Jobs] Get Service Center Scheduled Report'
);
export const GetServiceCenterScheduledReportFail = createAction(
  '[Jobs] Get Service Center Scheduled Fail',
  props<{ payload: any }>()
);
export const GetServiceCenterScheduledReportSuccess = createAction(
  '[Jobs] Get Service Center Scheduled Success',
  props<{ payload: IReservations.IServicesReport }>()
);

// Get Service Center Scheduled Amended Report
export const GetServiceCenterScheduledAmendedReport = createAction(
  '[Jobs] Get Service Center Scheduled Amended Report'
);
export const GetServiceCenterScheduledAmendedReportFail = createAction(
  '[Jobs] Get Service Center Scheduled Amended Report Fail',
  props<{ payload: any }>()
);
export const GetServiceCenterScheduledAmendedReportSuccess = createAction(
  '[Jobs] Get ReservaService Center Scheduledtion Amended Report Success',
  props<{ payload: IReservations.IAmendedsReport }>()
);

// Get Service Center Scheduled Job Report
export const GetServiceCenterScheduledJobReport = createAction(
  '[Jobs] Get Service Center Scheduled Job Report'
);
export const GetServiceCenterScheduledJobReportFail = createAction(
  '[Jobs] Get Service Center Scheduled Job Report Fail',
  props<{ payload: any }>()
);
export const GetServiceCenterScheduledJobReportSuccess = createAction(
  '[Jobs] Get Service Center Scheduled Job Report Success',
  props<{ payload: IReservations.IJobsReport }>()
);

// Reset Service Center Calendar
export const ResetServiceCenterCalendar = createAction(
  '[Jobs] Reset Service Center Calendar'
);

// Assign Operation Team
export const ServiceCenterAssignOperationTeam = createAction(
  '[Jobs] Service Center Assign Operation Team',
  props<{
    payload: {
      reservation: IReservations.IDocument;
      assign: IReservations.IAssign;
    };
  }>()
);
export const ServiceCenterAssignOperationTeamFail = createAction(
  '[Jobs] Service Center Assign Operation Team Fail',
  props<{ payload: any }>()
);
export const ServiceCenterAssignOperationTeamSuccess = createAction(
  '[Jobs] Service Center Assign Operation Team Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Reset Reservation
export const ResetServiceCenterReservation = createAction(
  '[Jobs] Reset Service Center Reservation',
  props<{ payload: IReservations.IDocument }>()
);
export const ResetServiceCenterReservationFail = createAction(
  '[Jobs] Reset Service Center Reservation Fail',
  props<{ payload: any }>()
);
export const ResetServiceCenterReservationSuccess = createAction(
  '[Jobs] Reset Service Center Reservation Success',
  props<{ payload: Update<IReservations.IDocument> }>()
);

// Reset Selected Service Center Scheduled
export const ResetSelectedServiceCenterScheduled = createAction(
  '[Jobs] Reset Selected Service Center Scheduled'
);

// Delete Service Center Scheduled Success
export const DeleteServiceCenterScheduledSuccess = createAction(
  '[Jobs] Delete Service Center Scheduled Success',
  props<{ payload: any }>()
);

// Get Service Center Slots
export const GetServiceCenterSlots = createAction(
  '[Jobs] Get Service Center Slots'
);
export const GetServiceCenterSlotsFail = createAction(
  '[Jobs] Get Service Center Slots Fail',
  props<{ payload: any }>()
);
export const GetServiceCenterSlotsSuccess = createAction(
  '[Jobs] Get Service Center Slots Success',
  props<{ payload: IReservations.IReservationSlots }>()
);


const all = union({
  SetServiceCenterScheduledPage,
  SetServiceCenterScheduledFilter,
  LoadServiceCenterScheduled,
  LoadServiceCenterScheduledFail,
  LoadServiceCenterScheduledSuccess,
  GetServiceCenterScheduled,
  GetServiceCenterScheduledFail,
  GetServiceCenterScheduledSuccess,
  CancelServiceCenterScheduled,
  CancelServiceCenterScheduledFail,
  CancelServiceCenterScheduledSuccess,
  CompleteServiceCenterScheduled,
  CompleteServiceCenterScheduledFail,
  CompleteServiceCenterScheduledSuccess,
  GoToServiceCenterScheduledList,
  GetServiceCenterScheduledReport,
  GetServiceCenterScheduledReportFail,
  GetServiceCenterScheduledReportSuccess,
  GetServiceCenterScheduledAmendedReport,
  GetServiceCenterScheduledAmendedReportFail,
  GetServiceCenterScheduledAmendedReportSuccess,
  GetServiceCenterScheduledJobReport,
  GetServiceCenterScheduledJobReportFail,
  GetServiceCenterScheduledJobReportSuccess,
  IncrementDate,
  DecrementDate,
  ResetDate,
  RescheduleServiceCenterReservation,
  RescheduleServiceCenterReservationFail,
  RescheduleServiceCenterReservationSuccess,
  GetServiceCenterCalendarList,
  GetServiceCenterCalendarListFail,
  GetServiceCenterCalendarListSuccess,
  ResetServiceCenterCalendar,
  ServiceCenterAssignOperationTeam,
  ServiceCenterAssignOperationTeamFail,
  ServiceCenterAssignOperationTeamSuccess,
  ResetServiceCenterReservation,
  ResetServiceCenterReservationFail,
  ResetServiceCenterReservationSuccess,
  ResetSelectedServiceCenterScheduled,
  DeleteServiceCenterScheduledSuccess,
  GetServiceCenterSlots,
  GetServiceCenterSlotsFail,
  GetServiceCenterSlotsSuccess
});
export type ServiceCenterScheduledsActionsUnion = typeof all;
