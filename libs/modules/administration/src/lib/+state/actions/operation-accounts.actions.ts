import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IAccount } from '../../models';

// Set Operation Accounts Page
export const SetOperationAccountsPage = createAction(
  '[Admin] Set Operation Accounts Page',
  props<{ payload: IAccount.IConfig }>()
);

// Load Operation Accounts
export const LoadOperationAccounts = createAction(
  '[Admin] Load Operation Accounts'
);
export const LoadOperationAccountsFail = createAction(
  '[Admin] Load Operation Accounts Fail',
  props<{ payload: any }>()
);
export const LoadOperationAccountsSuccess = createAction(
  '[Admin] Load Operation Accounts Success',
  props<{ accounts: IAccount.IDocument[]; pagination: IAccount.IPagination }>()
);

// Update Password
export const UpdateOperationPassword = createAction(
  '[Admin] Update Operation Password',
  props<{ payload: IAccount.IUpdatePass }>()
);
export const UpdateOperationPasswordFail = createAction(
  '[Admin] Update Operation Password Fail',
  props<{ payload: any }>()
);
export const UpdateOperationPasswordSuccess = createAction(
  '[Admin] Update Operation Password Success',
  props<{ payload: IAccount.IDocument }>()
);

// Filter Operation Accounts
export const FilterOperationAccounts = createAction(
  '[Admin] Filter Operation Accounts',
  props<{ payload: IAccount.IFilter }>()
);

// Sort Operation Accounts
export const SortOperationAccounts = createAction(
  '[Admin] Sort Operation Accounts',
  props<{ payload: IAccount.ISort }>()
);

// Reset Filter Operation Accounts
export const ResetFilterOperationAccounts = createAction(
  '[Admin] Reset Filter Operation Accounts'
);

// Reset Sort Operation Accounts
export const ResetSortOperationAccounts = createAction(
  '[Admin] Reset Operation Sort Accounts'
);

// Reset Selected Operation Account
export const ResetSelectedOperationAccount = createAction(
  '[Admin] Reset Selected Operation Account'
);

// Create Operation Accounts
export const CreateOperationAccount = createAction(
  '[Admin] Create Operation Account',
  props<{ payload: IAccount.ICreate }>()
);
export const CreateOperationAccountFail = createAction(
  '[Admin] Create Operation Account Fail',
  props<{ payload: any }>()
);
export const CreateOperationAccountSuccess = createAction(
  '[Admin] Create Operation Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Update Operation Accounts
export const UpdateOperationAccount = createAction(
  '[Admin] Update Operation Account',
  props<{ payload: IAccount.IDocument }>()
);
export const UpdateOperationAccountFail = createAction(
  '[Admin] Update Operation Account Fail',
  props<{ payload: any }>()
);
export const UpdateOperationAccountSuccess = createAction(
  '[Admin] Update Operation Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Delete Operation Accounts
export const DeleteOperationAccount = createAction(
  '[Admin] Delete Operation Account',
  props<{ payload: IAccount.IDocument }>()
);
export const DeleteOperationAccountFail = createAction(
  '[Admin] Delete Operation Account Fail',
  props<{ payload: any }>()
);
export const DeleteOperationAccountSuccess = createAction(
  '[Admin] Delete Operation Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Activate Operation Accounts
export const ActivateOperationAccount = createAction(
  '[Admin] Activate Operation Account',
  props<{ payload: IAccount.IDocument }>()
);
export const ActivateOperationAccountFail = createAction(
  '[Admin] Activate Operation Account Fail',
  props<{ payload: any }>()
);
export const ActivateOperationAccountSuccess = createAction(
  '[Admin] Activate Operation Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Deactivate Operation Accounts
export const DeactivateOperationAccount = createAction(
  '[Admin] Deactivate Operation Account',
  props<{ payload: IAccount.IDocument }>()
);
export const DeactivateOperationAccountFail = createAction(
  '[Admin] Deactivate Operation Account Fail',
  props<{ payload: any }>()
);
export const DeactivateOperationAccountSuccess = createAction(
  '[Admin] Deactivate Operation Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Get Operation Account
export const GetOperationAccount = createAction(
  '[Admin] Get Operation Account',
  props<{ payload: string }>()
);
export const GetOperationAccountFail = createAction(
  '[Admin] Get Operation Account Fail',
  props<{ payload: any }>()
);
export const GetOperationAccountSuccess = createAction(
  '[Admin] Get Operation Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Reset Operation Account Status
export const ResetOperationAccountStatus = createAction(
  '[Admin] Reset Operation Account Status',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// redirect
export const RedirectToOperationAccounts = createAction(
  '[Configuration] Redirect To Operation Accounts'
);

// Resync Account
export const ResyncOperationAccount = createAction(
  '[Admin] Resync Account Operation',
  props<{ payload: IAccount.IDocument }>()
);
export const ResyncOperationAccountFail = createAction(
  '[Admin] Resync Account Operation Fail',
  props<{ payload: any }>()
);
export const ResyncOperationAccountSuccess = createAction(
  '[Admin] Resync Account Operation Success',
  props<{ payload: IAccount.IDocument }>()
);

const all = union({
  SetOperationAccountsPage,
  FilterOperationAccounts,
  SortOperationAccounts,
  ResetFilterOperationAccounts,
  ResetSortOperationAccounts,
  ResetSelectedOperationAccount,
  LoadOperationAccounts,
  LoadOperationAccountsFail,
  LoadOperationAccountsSuccess,
  CreateOperationAccount,
  CreateOperationAccountFail,
  CreateOperationAccountSuccess,
  UpdateOperationAccount,
  UpdateOperationAccountFail,
  UpdateOperationAccountSuccess,
  DeleteOperationAccount,
  DeleteOperationAccountFail,
  DeleteOperationAccountSuccess,
  ActivateOperationAccount,
  ActivateOperationAccountFail,
  ActivateOperationAccountSuccess,
  DeactivateOperationAccount,
  DeactivateOperationAccountFail,
  DeactivateOperationAccountSuccess,
  GetOperationAccount,
  GetOperationAccountFail,
  GetOperationAccountSuccess,
  ResetOperationAccountStatus,
  UpdateOperationPassword,
  UpdateOperationPasswordFail,
  UpdateOperationPasswordSuccess,
  RedirectToOperationAccounts,
  ResyncOperationAccount,
  ResyncOperationAccountFail,
  ResyncOperationAccountSuccess
});
export type OperationAccountsActionsUnion = typeof all;
