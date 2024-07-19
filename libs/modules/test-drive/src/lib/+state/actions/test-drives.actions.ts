import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// TestDrives
import { ITestDrives } from '../../models';
import { IError } from '@neural/shared/data';
import { Auth } from '@neural/auth';
import { IBranches } from '@neural/modules/customer/corporate';

// Set TestDrives Page
export const SetTestDrivesPage = createAction(
  '[Hub] Set Test Drives Page',
  props<{ payload: ITestDrives.IConfig }>()
);

// Load TestDrives
export const LoadTestDrives = createAction('[Hub] Load Test Drives');
export const LoadTestDrivesFail = createAction(
  '[Hub] Load Test Drives Fail',
  props<{ payload: IError }>()
);
export const LoadTestDrivesSuccess = createAction(
  '[Hub] Load Test Drives Success',
  props<{
    testDrives: ITestDrives.IDocument[];
    pagination: ITestDrives.IPagination;
  }>()
);

// Cancel Test Drive
export const CancelTestDrive = createAction(
  '[Hub] Cancel Test Drive',
  props<{ payload: ITestDrives.IDocument }>()
);
export const CancelTestDriveFail = createAction(
  '[Hub] Cancel Test Drive Fail',
  props<{ payload: IError }>()
);
export const CancelTestDriveSuccess = createAction(
  '[Hub] Cancel Test Drive Success',
  props<{ payload: Update<ITestDrives.IDocument> }>()
);

// Complete Test Drive
export const CompleteTestDrive = createAction(
  '[Hub] Complete Test Drive',
  props<{ payload: ITestDrives.IDocument }>()
);
export const CompleteTestDriveFail = createAction(
  '[Hub] Complete Test Drive Fail',
  props<{ payload: IError }>()
);
export const CompleteTestDriveSuccess = createAction(
  '[Hub] Complete Test Drive Success',
  props<{ payload: Update<ITestDrives.IDocument> }>()
);

// Update Test Drive
export const UpdateTestDrive = createAction(
  '[Hub] Update Test Drive',
  props<{ payload: ITestDrives.IDocument }>()
);
export const UpdateTestDriveFail = createAction(
  '[Hub] Update Test Drive Fail',
  props<{ payload: IError }>()
);
export const UpdateTestDriveSuccess = createAction(
  '[Hub] Update Test Drive Success',
  props<{ payload: Update<ITestDrives.IDocument> }>()
);

// Get TestDrives
export const GetTestDrive = createAction(
  '[Hub] Get Test Drive',
  props<{ payload: string }>()
);
export const GetTestDriveFail = createAction(
  '[Hub] Get Test Drive Fail',
  props<{ payload: IError }>()
);
export const GetTestDriveSuccess = createAction(
  '[Hub] Get Test Drive Success',
  props<{ payload: ITestDrives.IDocument }>()
);

// Reset Selected Test Drive
export const ResetSelectedTestDrive = createAction(
  '[Hub] Reset Selected Test Drive'
);

// Get Sales
export const GetTestDriveSaleAdvisors = createAction(
  '[Hub] Get Test Drive Sale Advisors'
);
export const GetTestDriveSaleAdvisorsFail = createAction(
  '[Hub] Get Test Drive Sale Advisors Fail',
  props<{ payload: IError }>()
);
export const GetTestDriveSaleAdvisorsSuccess = createAction(
  '[Hub] Get Test Drive Sale Advisors Success',
  props<{ payload: Auth.IAccount[] }>()
);

// Get Sales
export const GetTestDriveCalendar = createAction(
  '[Hub] Get Test Drive Calendar Advisors',
  props<{ payload: {filter: ITestDrives.IFilter, adtorque: boolean} }>()
);
export const GetTestDriveCalendarFail = createAction(
  '[Hub] Get Test Drive Calendar Fail',
  props<{ payload: IError }>()
);
export const GetTestDriveCalendarSuccess = createAction(
  '[Hub] Get Test Drive Calendar Success',
  props<{ payload: ITestDrives.ITestDriveCalendar[] }>()
);

// redirect
export const RedirectToTestDrives = createAction(
  '[Configuration] Redirect To Test Drives'
);

// Get Branch
export const GetBranch = createAction(
  '[Customer] Get Branch For Test Drive',
  props<{ payload: string }>()
);
export const GetBranchFail = createAction(
  '[Customer] Get Branch For Test Drive Fail',
  props<{ payload: any }>()
);
export const GetBranchSuccess = createAction(
  '[Customer] Get Branch For Test Drive Success',
  props<{ payload: IBranches.IDocument }>()
);

const all = union({
  SetTestDrivesPage,
  LoadTestDrives,
  LoadTestDrivesFail,
  LoadTestDrivesSuccess,
  CancelTestDrive,
  CancelTestDriveFail,
  CancelTestDriveSuccess,
  CompleteTestDrive,
  CompleteTestDriveFail,
  CompleteTestDriveSuccess,
  UpdateTestDrive,
  UpdateTestDriveFail,
  UpdateTestDriveSuccess,
  ResetSelectedTestDrive,
  GetTestDrive,
  GetTestDriveFail,
  GetTestDriveSuccess,
  GetTestDriveSaleAdvisors,
  GetTestDriveSaleAdvisorsFail,
  GetTestDriveSaleAdvisorsSuccess,
  GetTestDriveCalendar,
  GetTestDriveCalendarFail,
  GetTestDriveCalendarSuccess,
  RedirectToTestDrives,
  GetBranchFail,
  GetBranch,
  GetBranchSuccess
});
export type TestDrivesActionsUnion = typeof all;
