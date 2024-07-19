import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IManualReservations, IReservations } from '../../models';
import { ICalendars } from '@neural/modules/calendar';
import { IError } from '@neural/shared/data';
import { Auth } from '@neural/auth';

// Change Manual Reservations Page
export const SetManualReservations = createAction(
  '[Hub] Set Manual Reservations Page',
  props<{
    payload: IManualReservations.IConfig;
  }>()
);

// Change Manual Reservations Page
export const ChangeManualReservations = createAction(
  '[Hub] Change Manual Reservations Page',
  props<{ payload: IManualReservations.IConfig }>()
);

// Change Manual Reservations Filter
export const ChangeManualReservationsFilter = createAction(
  '[Hub] Change Manual Reservations Filter',
  props<{ payload: IManualReservations.IFilter }>()
);

// Load Manual Reservations
export const LoadManualReservations = createAction(
  '[Hub] Load Manual Reservations'
);
export const LoadManualReservationsFail = createAction(
  '[Hub] Load Manual Reservations Fail',
  props<{ payload: IError }>()
);
export const LoadManualReservationsSuccess = createAction(
  '[Hub] Load Manual Reservations Success',
  props<{
    payload: {
      manualReservations: IManualReservations.IDocument[];
      pagination: IManualReservations.IPagination;
    };
  }>()
);

// Select Calendar Slot
export const SelectCalendarSlot = createAction(
  '[Hub] Select Calendar Slot',
  props<{
    payload: {
      selectedDay: ICalendars.IDocument;
      selectedSlot: ICalendars.ISlot;
    };
  }>()
);

// Get Sales
export const GetManualReservationOperations = createAction(
  '[Hub] Get Manual Reservation Operations'
);
export const GetManualReservationOperationsFail = createAction(
  '[Hub] Get Manual Reservation Operations Fail',
  props<{ payload: IError }>()
);
export const GetManualReservationOperationsSuccess = createAction(
  '[Hub] Get Manual Reservation Operations Success',
  props<{ payload: Auth.IAccount[] }>()
);

// Create Manual Reservation
export const CreateManualReservation = createAction(
  '[Hub] Create Manual Reservation',
  props<{ payload: IManualReservations.ICreate }>()
);
export const CreateManualReservationFail = createAction(
  '[Hub] Create Manual Reservation Fail',
  props<{ payload: IError }>()
);
export const CreateManualReservationSuccess = createAction(
  '[Hub] Create Manual Reservation Success',
  props<{ payload: IManualReservations.IDocument }>()
);

// Update Manual Reservation
export const UpdateManualReservation = createAction(
  '[Hub] Update Manual Reservation',
  props<{ payload: IManualReservations.IDocument }>()
);
export const UpdateManualReservationFail = createAction(
  '[Hub] Update Manual Reservation Fail',
  props<{ payload: IError }>()
);
export const UpdateManualReservationSuccess = createAction(
  '[Hub] Update Manual Reservation Success',
  props<{ payload: Update<IManualReservations.IDocument> }>()
);

// Delete Manual Reservation
export const DeleteManualReservation = createAction(
  '[Hub] Delete Manual Reservation',
  props<{ payload: IManualReservations.IDocument }>()
);
export const DeleteManualReservationFail = createAction(
  '[Hub] Delete Manual Reservation Fail',
  props<{ payload: IError }>()
);
export const DeleteManualReservationSuccess = createAction(
  '[Hub] Delete Manual Reservation Success',
  props<{ payload: IManualReservations.IDocument }>()
);

// Delete Mobile Manual Reservation
export const DeleteManualMobileReservation = createAction(
  '[Jobs] Delete Manual Mobile Reservation',
  props<{ payload: IManualReservations.IDocument }>()
);
export const DeleteManualMobileReservationFail = createAction(
  '[Jobs] Delete Manual Mobile Reservation Fail',
  props<{ payload: IError }>()
);
export const DeleteManualMobileReservationSuccess = createAction(
  '[Jobs] Delete Manual Mobile Reservation Success',
  props<{ payload: IManualReservations.IDocument }>()
);

// Delete Manual Service Reservation
export const DeleteManualServiceReservation = createAction(
  '[Jobs] Delete Manual Service Reservation',
  props<{ payload: IManualReservations.IDocument }>()
);
export const DeleteManualServiceReservationFail = createAction(
  '[Jobs] Delete Manual Service Reservation Fail',
  props<{ payload: IError }>()
);
export const DeleteManualServiceReservationSuccess = createAction(
  '[Jobs] Delete Manual Service Reservation Success',
  props<{ payload: IManualReservations.IDocument }>()
);

// Complete Manual Service Reservation
export const CompleteManualReservation = createAction(
  '[Jobs] Complete Manual Reservation',
  props<{ payload: IManualReservations.IDocument }>()
);
export const CompleteManualReservationFail = createAction(
  '[Jobs] Complete Manual Reservation Fail',
  props<{ payload: IError }>()
);
export const CompleteManualReservationSuccess = createAction(
  '[Jobs] Complete Manual Reservation Success',
  props<{ payload: Update<IManualReservations.IDocument> }>()
);

// Complete Manual Service Reservation
export const ResetManualReservation = createAction(
  '[Jobs] Reset Manual Reservation',
  props<{ payload: IManualReservations.IDocument }>()
);
export const ResetManualReservationFail = createAction(
  '[Jobs] Reset Manual Reservation Fail',
  props<{ payload: IError }>()
);
export const ResetManualReservationSuccess = createAction(
  '[Jobs] Reset Manual Reservation Success',
  props<{ payload: Update<IManualReservations.IDocument> }>()
);

export const UpdateCalendar = createAction(
  '[Hub] Update Calendar Upon Reservation'
);

// Get Manual Reservation
export const GetManualReservation = createAction(
  '[Hub] Get Manual Reservation',
  props<{ payload: string }>()
);
export const GetManualReservationFail = createAction(
  '[Hub] Get Manual Reservation Fail',
  props<{ payload: IError }>()
);
export const GetManualReservationSuccess = createAction(
  '[Hub] Get Manual Reservation Success',
  props<{ payload: IManualReservations.IDocument }>()
);

// Cancel manual reservation
export const CancelManualReservation = createAction(
  '[Jobs] Cancel Manual Reservation',
  props<{ payload: IManualReservations.IDocument }>()
);
export const CancelManualReservationFail = createAction(
  '[Jobs] Cancel  Manual Reservation Fail',
  props<{ payload: IError }>()
);
export const CancelManualReservationSuccess = createAction(
  '[Jobs] Cancel  Manual Reservation Success',
  props<{ payload: Update<IManualReservations.IDocument> }>()
);

//Get DMS customers
export const GetDMSCustomers = createAction(
  '[Jobs] Get DMS Customers',
  props<{ payload: { dms: IManualReservations.IDMSFilter } }>()
);
export const GetDMSCustomersFail = createAction(
  '[Jobs] Get DMS Customers Fail',
  props<{ payload: IError }>()
);
export const GetDMSCustomersSuccess = createAction(
  '[Jobs] Get DMS Customers Success',
  props<{ payload: IManualReservations.IDMSCustomer[] }>()
);

//Get DMS Vehicles
export const GetDMSVehicles = createAction(
  '[Jobs] Get DMS Vehicles',
  props<{ payload: string }>()
);

export const GetDMSVehiclesFail = createAction(
  '[Jobs] Get DMS Vehicles Fail',
  props<{ payload: IError }>()
);

export const GetDMSVehiclesSuccess = createAction(
  '[Jobs] Get DMS Vehicles Success',
  props<{ payload: IReservations.IAccountVehicle[] }>()
);

//Reset dms vehicles loaded
export const ResetDMSVehiclesLoaded = createAction(
  '[Jobs] Reset DMS Vehicles Loaded'
);

//Reset dms vehicles
export const ResetDMSVehicles = createAction('[Jobs] Reset DMS Vehicles');

export const ResetDMSCustomers = createAction('[Jobs] Reset DMS Customers');

//Add new manual reservation
export const AddNewManualReservation = createAction(
  '[Core]Add New Manual Reservation'
);

// Branch Change
export const GoToReservationsList = createAction(
  '[Hub] Go To Reservations List'
);

export const GetVehicleMakes = createAction(
  '[Jobs] Get CDK VehicleMake',
  props<{ payload: IManualReservations.IConfig }>()
);
export const GetVehicleMakesFail = createAction(
  '[Jobs] Get CDK VehicleMake Fail',
  props<{ payload: IError }>()
);
export const GetVehicleMakesSuccess = createAction(
  '[Jobs] Get CDK VehicleMake Success',
  props<{ payload: IManualReservations.IVehicleMakes[]}>()
);

export const GetVehicleModels = createAction(
  '[Jobs] Get CDK Vehicle Models',
  props<{ payload: string }>()
);
export const GetVehicleModelsFail = createAction(
  '[Jobs] Get CDK Vehicle Models Fail',
  props<{ payload: IError }>()
);
export const GetVehicleModelsSuccess = createAction(
  '[Jobs] Get CDK Vehicle Models Success',
  props<{ payload: IManualReservations.IVehicleModels[] }>()
);

export const GetVehicleYearMakes = createAction(
  '[Jobs] Get CDK Vehicle Year Makes',
  props<{ makeId: string, modelId: string }>()
);

export const GetVehicleYearMakesFail = createAction(
  '[Jobs] Get CDK Vehicle Year Makes Fail',
  props<{ payload: IError }>()
);

export const GetVehicleYearMakesSuccess = createAction(
  '[Jobs] Get CDK Vehicle Year Makes Success',
  props<{ payload: IManualReservations.IVehicleYearMakes[] }>()
);

const all = union({
  ChangeManualReservations,
  ChangeManualReservationsFilter,
  LoadManualReservations,
  LoadManualReservationsFail,
  LoadManualReservationsSuccess,
  SelectCalendarSlot,
  GetManualReservationOperations,
  GetManualReservationOperationsFail,
  GetManualReservationOperationsSuccess,
  SetManualReservations,
  CreateManualReservation,
  CreateManualReservationFail,
  CreateManualReservationSuccess,
  UpdateManualReservation,
  UpdateManualReservationFail,
  UpdateManualReservationSuccess,
  DeleteManualReservation,
  DeleteManualReservationFail,
  DeleteManualReservationSuccess,
  GetManualReservation,
  GetManualReservationFail,
  GetManualReservationSuccess,
  UpdateCalendar,
  DeleteManualMobileReservation,
  DeleteManualMobileReservationFail,
  DeleteManualMobileReservationSuccess,
  DeleteManualServiceReservation,
  DeleteManualServiceReservationFail,
  DeleteManualServiceReservationSuccess,
  AddNewManualReservation,
  CompleteManualReservation,
  CompleteManualReservationFail,
  CompleteManualReservationSuccess,
  ResetManualReservation,
  ResetManualReservationFail,
  ResetManualReservationSuccess,
  CancelManualReservation,
  CancelManualReservationSuccess,
  CancelManualReservationFail,
  GoToReservationsList,
  GetDMSCustomers,
  GetDMSCustomersSuccess,
  GetDMSCustomersFail,
  GetDMSVehicles,
  GetDMSVehiclesFail,
  GetDMSVehiclesSuccess,
  ResetDMSVehiclesLoaded,
  ResetDMSCustomers,
  ResetDMSVehicles,
  GetVehicleMakes,
  GetVehicleMakesFail,
  GetVehicleMakesSuccess,
  GetVehicleModels,
  GetVehicleModelsFail,
  GetVehicleModelsSuccess,
  GetVehicleYearMakes,
  GetVehicleYearMakesFail,
  GetVehicleYearMakesSuccess
});
export type ManualReservationsActionsUnion = typeof all;
