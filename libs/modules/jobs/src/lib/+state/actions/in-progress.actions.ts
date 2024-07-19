import { createAction, props, union } from '@ngrx/store';

// Models
import { IReservations } from '../../models';


export const LoadInProgressJobList = createAction('[Jobs] Load In Progress Job List');
export const LoadInProgressJobListFail = createAction(
  '[Jobs] Load In Progress Job List Fail',
  props<{ payload: IReservations.IError }>()
);
export const LoadInProgressJobListSuccess = createAction(
  '[Jobs] Load In Progress Job List Success',
  props<{ payload: IReservations.IInProgressJobList }>()
);


export const GetInProgressJob = createAction(
  '[Hub] Get InProgressJob',
  props<{ payload: string }>()
);
export const GetInProgressJobFail = createAction(
  '[Hub] Get InProgressJob Fail',
  props<{ payload: IReservations.IError }>()
);
export const GetInProgressJobSuccess = createAction(
  '[Hub] Get InProgressJob Success',
  props<{ payload: IReservations.IInProgressJob }>()
);

// Load In Progress Job
export const LoadInProgressJob = createAction('[Jobs] Load In Progress Job');
export const LoadInProgressJobFail = createAction(
  '[Jobs] Load In Progress Job Fail',
  props<{ payload: IReservations.IError }>()
);
export const LoadInProgressJobSuccess = createAction(
  '[Jobs] Load In Progress Job Success',
  props<{ payload: IReservations.IInProgressJob }>()
);

// Load In Progress Job RealTime
export const LoadInProgressJobRealTime = createAction(
  '[Jobs] Load In Progress Job RealTime'
);

export const LoadInProgressJobRealTimeFail = createAction(
  '[Jobs] Load In Progress Job RealTime Fail',
  props<{ payload: IReservations.IError }>()
);
export const LoadInProgressJobRealTimeSuccess = createAction(
  '[Jobs] Load In Progress Job RealTime Success',
  props<{ payload: IReservations.IInProgressJob }>()
);

// Upload Repair Order Job
export const UploadRepairOrder = createAction(
  '[Jobs] Upload Repair Order Job',
  props<{ payload: IReservations.ICreate }>()
);
export const UploadRepairOrderFail = createAction(
  '[Jobs] Upload Repair Order Fail',
  props<{ payload: any }>()
);
export const UploadRepairOrderSuccess = createAction(
  '[Jobs] Upload Repair Order Success',
  props<{ payload: IReservations.IInProgressJob }>()
);

// Upload Progress Invoice Job
export const UploadProgressInvoice = createAction(
  '[Jobs] Upload Progress Invoice Job',
  props<{ payload: IReservations.IUpdate }>()
);
export const UploadProgressInvoiceFail = createAction(
  '[Jobs] Upload Progress Invoice Job Fail',
  props<{ payload: any }>()
);
export const UploadProgressInvoiceSuccess = createAction(
  '[Jobs] Upload Progress Invoice Job Success',
  props<{ payload: IReservations.IInProgressJob }>()
);

// Load Reservations Job
export const LoadReservationsJob = createAction('[Jobs] Load Reservations Job');
export const LoadReservationsJobFail = createAction(
  '[Jobs] Load Reservations Job Fail',
  props<{ payload: any }>()
);
export const LoadReservationsJobSuccess = createAction(
  '[Jobs] Load Reservations Job Success',
  props<{ payload: IReservations.IDocument }>()
);

// Load Reservations Report
export const GetOperationDailyReport = createAction(
  '[Jobs] Get Operation Daily Report',
  props<{ payload: string }>()
);
export const GetOperationDailyReportFail = createAction(
  '[Jobs] Get Operation Daily Report Fail',
  props<{ payload: any }>()
);
export const GetOperationDailyReportSuccess = createAction(
  '[Jobs] Get Operation Daily Report Success',
  props<{ payload: IReservations.IDailyReport }>()
);

// Complete Reservation
export const CompleteReservationByOpertaion = createAction(
  '[Jobs] Complete Reservation By Opertaion',
  props<{ payload: IReservations.IDocument }>()
);
export const CompleteReservationByOpertaionFail = createAction(
  '[Jobs] Complete Reservation By Opertaion Fail',
  props<{ payload: any }>()
);
export const CompleteReservationByOpertaionSuccess = createAction(
  '[Jobs] Complete Reservation By Opertaion Success',
  props<{ payload: IReservations.IDocument }>()
);
const all = union({
  LoadInProgressJob,
  LoadInProgressJobFail,
  LoadInProgressJobSuccess,
  LoadInProgressJobRealTime,
  LoadInProgressJobRealTimeFail,
  LoadInProgressJobRealTimeSuccess,
  UploadRepairOrder,
  UploadRepairOrderFail,
  UploadRepairOrderSuccess,
  UploadProgressInvoice,
  UploadProgressInvoiceFail,
  UploadProgressInvoiceSuccess,
  GetOperationDailyReport,
  GetOperationDailyReportFail,
  GetOperationDailyReportSuccess,
  CompleteReservationByOpertaion,
  CompleteReservationByOpertaionFail,
  CompleteReservationByOpertaionSuccess,
  LoadInProgressJobList,
  LoadInProgressJobListFail,
  LoadInProgressJobListSuccess,
  GetInProgressJob,
  GetInProgressJobSuccess,
  GetInProgressJobFail
});
export type InProgressActionsUnion = typeof all;
