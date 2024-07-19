import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IAccount } from '../../models';
import { IError } from '@neural/shared/data';

// Set Accounts Page
export const SetAccountsPage = createAction(
  '[Admin] Set Accounts Page',
  props<{ payload: IAccount.IConfig }>()
);

// Filter Accounts
export const FilterAccounts = createAction(
  '[Admin] Set Filter Accounts',
  props<{ payload: IAccount.IFilter }>()
);

// Sort Accounts
export const SortAccounts = createAction(
  '[Admin] Sort Accounts',
  props<{ payload: IAccount.ISort }>()
);

// Reset Filter Accounts
export const ResetFilterAccounts = createAction(
  '[Admin] Reset Filter Accounts'
);

// Reset Sort Accounts
export const ResetSortAccounts = createAction('[Admin] Reset Sort Accounts');

// Reset Selected Account
export const ResetSelectedAccount = createAction(
  '[Admin] Reset Selected Account'
);

// Load Accounts
export const LoadAccounts = createAction('[Admin] Load Accounts');
export const LoadAccountsFail = createAction(
  '[Admin] Load Accounts Fail',
  props<{ payload: IError }>()
);
export const LoadAccountsSuccess = createAction(
  '[Admin] Load Accounts Success',
  props<{ accounts: IAccount.IDocument[]; pagination: IAccount.IPagination }>()
);

// Create Accounts
export const CreateAccount = createAction(
  '[Admin] Create Account',
  props<{ payload: IAccount.ICreate }>()
);
export const CreateAccountFail = createAction(
  '[Admin] Create Account Fail',
  props<{ payload: any }>()
);
export const CreateAccountSuccess = createAction(
  '[Admin] Create Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Update Accounts
export const UpdateAccount = createAction(
  '[Admin] Update Account',
  props<{ payload: IAccount.IDocument }>()
);
export const UpdateAccountFail = createAction(
  '[Admin] Update Account Fail',
  props<{ payload: any }>()
);
export const UpdateAccountSuccess = createAction(
  '[Admin] Update Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Update Password
export const UpdatePassword = createAction(
  '[Admin] Update Password',
  props<{ payload: IAccount.IUpdatePass }>()
);
export const UpdatePasswordFail = createAction(
  '[Admin] Update Password Fail',
  props<{ payload: any }>()
);
export const UpdatePasswordSuccess = createAction(
  '[Admin] Update Password Success',
  props<{ payload: IAccount.IDocument }>()
);

// Delete Accounts
export const DeleteAccount = createAction(
  '[Admin] Delete Account',
  props<{ payload: IAccount.IDocument }>()
);
export const DeleteAccountFail = createAction(
  '[Admin] Delete Account Fail',
  props<{ payload: any }>()
);
export const DeleteAccountSuccess = createAction(
  '[Admin] Delete Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Activate Accounts
export const ActivateAccount = createAction(
  '[Admin] Activate Account',
  props<{ payload: IAccount.IDocument }>()
);
export const ActivateAccountFail = createAction(
  '[Admin] Activate Account Fail',
  props<{ payload: any }>()
);
export const ActivateAccountSuccess = createAction(
  '[Admin] Activate Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Deactivate Accounts
export const DeactivateAccount = createAction(
  '[Admin] Deactivate Account',
  props<{ payload: IAccount.IDocument }>()
);
export const DeactivateAccountFail = createAction(
  '[Admin] Deactivate Account Fail',
  props<{ payload: any }>()
);
export const DeactivateAccountSuccess = createAction(
  '[Admin] Deactivate Account Success',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// Get Account
export const GetAccount = createAction(
  '[Admin] Get Account',
  props<{ payload: string }>()
);
export const GetAccountFail = createAction(
  '[Admin] Get Account Fail',
  props<{ payload: IError }>()
);
export const GetAccountSuccess = createAction(
  '[Admin] Get Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Reset Account Status
export const ResetAccountStatus = createAction(
  '[Admin] Reset Account Status',
  props<{ payload: Update<IAccount.IDocument> }>()
);

// redirect
export const RedirectToAccounts = createAction(
  '[Configuration] Redirect To Accounts'
);

// Search Account
export const SearchAccount = createAction(
  '[Admin] Search Account',
  props<{ payload: string }>()
);
export const SearchAccountFail = createAction(
  '[Admin] Search Account Fail',
  props<{ payload: any }>()
);
export const SearchAccountSuccess = createAction(
  '[Admin] Search Account Success',
  props<{ payload: IAccount.IDocument }>()
);

export const ResetSearchedAccount = createAction(
  '[Admin] Reset Search Account'
);

// Update Searched Accounts
export const UpdateSearchedAccount = createAction(
  '[Admin] Update Searched Account',
  props<{ payload: IAccount.IDocument }>()
);
export const UpdateSearchedAccountFail = createAction(
  '[Admin] Update Searched Account Fail',
  props<{ payload: any }>()
);
export const UpdateSearchedAccountSuccess = createAction(
  '[Admin] Update Searched Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Resync Account
export const ResyncAccount = createAction(
  '[Admin] Resync Account',
  props<{ payload: IAccount.IDocument }>()
);
export const ResyncAccountFail = createAction(
  '[Admin] Resync Account Fail',
  props<{ payload: any }>()
);
export const ResyncAccountSuccess = createAction(
  '[Admin] Resync Account Success',
  props<{ payload: IAccount.IDocument }>()
);

// Resync firbase
export const ResyncFirebase = createAction(
  '[Admin] Resync Firebase',
  props<{ payload: IAccount.IDocument }>()
);
export const ResyncFirebaseFail = createAction(
  '[Admin] Resync Firebase Fail',
  props<{ payload: any }>()
);
export const ResyncFirebaseSuccess = createAction(
  '[Admin] Resync Firebase Success',
  props<{ payload: IAccount.IDocument }>()
);

// Synchronization
export const Synchronization = createAction(
  '[Admin] Synchronization',
  props<{ payload: IAccount.ISynchronization }>()
);
export const SynchronizationFail = createAction(
  '[Admin] Synchronization Fail',
  props<{ payload: any }>()
);
export const SynchronizationSuccess = createAction(
  '[Admin] Synchronization Success',
  props<{ payload: any }>()
);

const all = union({
  SetAccountsPage,
  LoadAccounts,
  LoadAccountsFail,
  LoadAccountsSuccess,
  CreateAccount,
  CreateAccountFail,
  CreateAccountSuccess,
  UpdateAccount,
  UpdateAccountFail,
  UpdateAccountSuccess,
  DeleteAccount,
  DeleteAccountFail,
  DeleteAccountSuccess,
  ActivateAccount,
  ActivateAccountFail,
  ActivateAccountSuccess,
  DeactivateAccount,
  DeactivateAccountFail,
  DeactivateAccountSuccess,
  GetAccount,
  GetAccountFail,
  GetAccountSuccess,
  ResetAccountStatus,
  ResetSelectedAccount,
  ResetSortAccounts,
  UpdatePassword,
  UpdatePasswordFail,
  UpdatePasswordSuccess,
  RedirectToAccounts,
  SearchAccount,
  SearchAccountFail,
  SearchAccountSuccess,
  ResetSearchedAccount,
  UpdateSearchedAccount,
  UpdateSearchedAccountFail,
  UpdateSearchedAccountSuccess,
  ResyncAccount,
  ResyncAccountFail,
  ResyncAccountSuccess,
  Synchronization,
  SynchronizationFail,
  SynchronizationSuccess,
  ResyncFirebase,
  ResyncFirebaseFail,
  ResyncFirebaseSuccess,
});
export type AccountsActionsUnion = typeof all;
