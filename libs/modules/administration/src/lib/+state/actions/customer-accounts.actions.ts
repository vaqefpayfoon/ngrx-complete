import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IAccount } from '../../models';
import { IError } from '@neural/shared/data';
import { ICorporates } from '@neural/modules/customer/corporate';

// Set Customer Accounts Page
export const SetCustomerAccountsPage = createAction(
  '[Admin] Set Customer Accounts Page',
  props<{ payload: IAccount.IConfig }>()
);

// Load Customer Accounts
export const LoadCustomerAccounts = createAction(
  '[Admin] Load Customer Accounts'
);
export const LoadCustomerAccountsFail = createAction(
  '[Admin] Load Customer Accounts Fail',
  props<{ payload: IError}>()
);
export const LoadCustomerAccountsSuccess = createAction(
  '[Admin] Load Customer Accounts Success',
  props<{ accounts: IAccount.IDocument[]; pagination: IAccount.IPagination }>()
);

// Update Password
export const UpdateCustomerPassword = createAction(
  '[Admin] Update Customer Password',
  props<{ payload: IAccount.IUpdatePass }>()
);
export const UpdateCustomerPasswordFail = createAction(
  '[Admin] Update Customer Password Fail',
  props<{ payload: any }>()
);
export const UpdateCustomerPasswordSuccess = createAction(
  '[Admin] Update Customer Password Success',
  props<{ payload: IAccount.IDocument }>()
);

// Filter Customer Accounts
export const FilterCustomerAccounts = createAction(
  '[Admin] Filter Customer Accounts',
  props<{ payload: IAccount.IFilter }>()
);

// Sort Customer Accounts
export const SortCustomerAccounts = createAction(
  '[Admin] Sort Customer Accounts',
  props<{ payload: IAccount.ISort }>()
);

// Reset Filter Customer Accounts
export const ResetFilterCustomerAccounts = createAction(
  '[Admin] Reset Filter Customer Accounts'
);

// Reset Sort Customer Accounts
export const ResetSortCustomerAccounts = createAction(
  '[Admin] Reset Customer Sort Accounts'
);

// Reset Selected Customer Account
export const ResetSelectedCustomerAccount = createAction(
  '[Admin] Reset Selected Customer Account'
);

// Create Customer Accounts
export const CreateCustomerAccount = createAction(
  '[Admin] Create Customer Account',
  props<{ payload: IAccount.ICreate }>()
);
export const CreateCustomerAccountFail = createAction(
  '[Admin] Create Customer Account Fail',
  props<{ payload: any }>()
);
export const CreateCustomerAccountSuccess = createAction(
  '[Admin] Create Customer Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Update Customer Accounts
export const UpdateCustomerAccount = createAction(
  '[Admin] Update Customer Account',
  props<{ payload: IAccount.IDocument }>()
);
export const UpdateCustomerAccountFail = createAction(
  '[Admin] Update Customer Account Fail',
  props<{ payload: any }>()
);
export const UpdateCustomerAccountSuccess = createAction(
  '[Admin] Update Customer Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Delete Customer Accounts
export const DeleteCustomerAccount = createAction(
  '[Admin] Delete Customer Account',
  props<{ payload: IAccount.IDocument }>()
);
export const DeleteCustomerAccountFail = createAction(
  '[Admin] Delete Customer Account Fail',
  props<{ payload: any }>()
);
export const DeleteCustomerAccountSuccess = createAction(
  '[Admin] Delete Customer Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Activate Customer Accounts
export const ActivateCustomerAccount = createAction(
  '[Admin] Activate Customer Account',
  props<{ payload: IAccount.IDocument }>()
);
export const ActivateCustomerAccountFail = createAction(
  '[Admin] Activate Customer Account Fail',
  props<{ payload: any }>()
);
export const ActivateCustomerAccountSuccess = createAction(
  '[Admin] Activate Customer Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Deactivate Customer Accounts
export const DeactivateCustomerAccount = createAction(
  '[Admin] Deactivate Customer Account',
  props<{ payload: IAccount.IDocument }>()
);
export const DeactivateCustomerAccountFail = createAction(
  '[Admin] Deactivate Customer Account Fail',
  props<{ payload: any }>()
);
export const DeactivateCustomerAccountSuccess = createAction(
  '[Admin] Deactivate Customer Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Get Customer Account
export const GetCustomerAccount = createAction(
  '[Admin] Get Customer Account',
  props<{ payload: string }>()
);
export const GetCustomerAccountFail = createAction(
  '[Admin] Get Customer Account Fail',
  props<{ payload: any }>()
);
export const GetCustomerAccountSuccess = createAction(
  '[Admin] Get Customer Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Reset Customer Account Status
export const ResetCustomerAccountStatus = createAction(
  '[Admin] Reset Customer Account Status',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// redirect
export const RedirectToCustomerAccounts = createAction(
  '[Configuration] Redirect To Customer Accounts'
);

// Resync Account
export const ResyncCustomerAccount = createAction(
  '[Admin] Resync Account Customer',
  props<{ payload: IAccount.IDocument }>()
);
export const ResyncCustomerAccountFail = createAction(
  '[Admin] Resync Account Customer Fail',
  props<{ payload: any }>()
);
export const ResyncCustomerAccountSuccess = createAction(
  '[Admin] Resync Account Customer Success',
  props<{ payload: IAccount.IDocument }>()
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

const all = union({
  SetCustomerAccountsPage,
  FilterCustomerAccounts,
  SortCustomerAccounts,
  ResetFilterCustomerAccounts,
  ResetSortCustomerAccounts,
  ResetSelectedCustomerAccount,
  LoadCustomerAccounts,
  LoadCustomerAccountsFail,
  LoadCustomerAccountsSuccess,
  CreateCustomerAccount,
  CreateCustomerAccountFail,
  CreateCustomerAccountSuccess,
  UpdateCustomerAccount,
  UpdateCustomerAccountFail,
  UpdateCustomerAccountSuccess,
  DeleteCustomerAccount,
  DeleteCustomerAccountFail,
  DeleteCustomerAccountSuccess,
  ActivateCustomerAccount,
  ActivateCustomerAccountFail,
  ActivateCustomerAccountSuccess,
  DeactivateCustomerAccount,
  DeactivateCustomerAccountFail,
  DeactivateCustomerAccountSuccess,
  GetCustomerAccount,
  GetCustomerAccountFail,
  GetCustomerAccountSuccess,
  ResetCustomerAccountStatus,
  UpdateCustomerPassword,
  UpdateCustomerPasswordFail,
  UpdateCustomerPasswordSuccess,
  RedirectToCustomerAccounts,
  ResyncCustomerAccount,
  ResyncCustomerAccountFail,
  ResyncCustomerAccountSuccess,
  LoadCorporate,
  LoadCorporateFail,
  LoadCorporateSuccess
});
export type CustomerAccountsActionsUnion = typeof all;
