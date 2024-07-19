import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IWarranties } from '../../models';
import { IError } from '@neural/shared/data';

// Set Warranties Page
export const SetWarrantiesPage = createAction(
  '[Jobs] Set Warranties Page',
  props<{ payload: IWarranties.IConfig }>()
);

// Load Warranties
export const LoadWarranties = createAction('[Jobs] Load Warranties');
export const LoadWarrantiesFail = createAction(
  '[Jobs] Load Warranties Fail',
  props<{ payload: IError }>()
);
export const LoadWarrantiesSuccess = createAction(
  '[Jobs] Load Warranties Success',
  props<{
    warranties: IWarranties.IDocument[];
    pagination: IWarranties.IPagination;
  }>()
);

// Load Accounts By Vin
export const LoadAccountsByVin = createAction(
  '[Jobs] Load Accounts By Vin',
  props<{ payload: IWarranties.IVin }>()
);
export const LoadAccountsByVinFail = createAction(
  '[Jobs] Load Accounts By Vin Fail',
  props<{ payload: any }>()
);
export const LoadAccountsByVinSuccess = createAction(
  '[Jobs] Load Accounts By Vin Success',
  props<{ payload: IWarranties.IDocumentVin }>()
);

// Reset Accounts By Vin Success
export const ResetAccountsByVinSuccess = createAction(
  '[Jobs] Reset Accounts By Vin Success'
);

// Reset Selected Warranty
export const ResetSelectedWarranty = createAction(
  '[Admin] Reset Selected Warranty'
);

// Create Warranty
export const CreateWarranty = createAction(
  '[Jobs] Create Warranty',
  props<{
    payload: {
      warranty: IWarranties.ICreate;
      entity: IWarranties.IDocumentVin;
    };
  }>()
);
export const CreateWarrantyFail = createAction(
  '[Jobs] Create Warranty Fail',
  props<{ payload: any }>()
);
export const CreateWarrantySuccess = createAction(
  '[Jobs] Create Warranty Success',
  props<{ payload: IWarranties.IDocument }>()
);

// Get Warranty
export const GetWarranty = createAction(
  '[Admin] Get Warranty',
  props<{ payload: string }>()
);
export const GetWarrantyFail = createAction(
  '[Admin] Get Warranty Fail',
  props<{ payload: any }>()
);
export const GetWarrantySuccess = createAction(
  '[Admin] Get Warranty Success',
  props<{ payload: IWarranties.IDocument }>()
);

// Close Warranty
export const CloseWarranty = createAction(
  '[Jobs] Close Warranty',
  props<{
    payload: { warranty: IWarranties.IDocument; form: IWarranties.IClose };
  }>()
);
export const CloseWarrantyFail = createAction(
  '[Jobs] Close Warranty Fail',
  props<{ payload: any }>()
);
export const CloseWarrantySuccess = createAction(
  '[Jobs] Close Warranty Success',
  props<{ payload: IWarranties.IDocument }>()
);

// Branch Change
export const GoToWarrantiesList = createAction('[Jobs] Go To Warranties List');

// Get Warranty Reminder Report
export const GetWarrantyReminderReport = createAction(
  '[Jobs] Get Warranty Reminder Report'
);
export const GetWarrantyReminderReportFail = createAction(
  '[Jobs] Get Warranty Reminder Report Fail',
  props<{ payload: any }>()
);
export const GetWarrantyReminderReportSuccess = createAction(
  '[Jobs] Get Warranty Reminder Report Success',
  props<{ payload: IWarranties.IWarrantiesReport }>()
);

// redirect
export const RedirectToWarranties = createAction(
  '[Configuration] Redirect To Warranties'
);

const all = union({
  SetWarrantiesPage,
  LoadWarranties,
  LoadWarrantiesFail,
  LoadWarrantiesSuccess,
  CreateWarranty,
  CreateWarrantyFail,
  CreateWarrantySuccess,
  GetWarranty,
  GetWarrantyFail,
  GetWarrantySuccess,
  LoadAccountsByVin,
  LoadAccountsByVinFail,
  LoadAccountsByVinSuccess,
  ResetAccountsByVinSuccess,
  ResetSelectedWarranty,
  CloseWarranty,
  CloseWarrantyFail,
  CloseWarrantySuccess,
  GoToWarrantiesList,
  GetWarrantyReminderReport,
  GetWarrantyReminderReportFail,
  GetWarrantyReminderReportSuccess,
  RedirectToWarranties,
});
export type WarrantiesActionsUnion = typeof all;
