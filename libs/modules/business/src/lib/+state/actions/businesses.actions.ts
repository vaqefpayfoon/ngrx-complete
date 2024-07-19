import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IBusinesses } from '../../models';
import { IAccount } from '@neural/modules/administration';

// Set Businesses Page
export const SetBusinessesPage = createAction(
  '[Admin] Set Businesses Page',
  props<{ payload: IBusinesses.IConfig }>()
);

// Load Businesses
export const LoadBusinesses = createAction('[Admin] Load Businesses');
export const LoadBusinessesFail = createAction(
  '[Admin] Load Businesses Fail',
  props<{ payload: any }>()
);
export const LoadBusinessesSuccess = createAction(
  '[Admin] Load Businesses Success',
  props<{
    payload: {
      businesses: IBusinesses.IDocument[];
      pagination: IBusinesses.IPagination;
    };
  }>()
);

// Activate Businesss
export const ActivateBusiness = createAction(
  '[Admin] Activate Business',
  props<{ payload: IBusinesses.IDocument }>()
);
export const ActivateBusinessFail = createAction(
  '[Admin] Activate Business Fail',
  props<{ payload: any }>()
);
export const ActivateBusinessSuccess = createAction(
  '[Admin] Activate Business Success',
  props<{ payload: Update<IBusinesses.IDocument> }>()
);

// Deactivate Businesss
export const DeactivateBusiness = createAction(
  '[Admin] Deactivate Business',
  props<{ payload: IBusinesses.IDocument }>()
);
export const DeactivateBusinessFail = createAction(
  '[Admin] Deactivate Business Fail',
  props<{ payload: any }>()
);
export const DeactivateBusinessSuccess = createAction(
  '[Admin] Deactivate Business Success',
  props<{ payload: Update<IBusinesses.IDocument> }>()
);

// Reset Business Status
export const ResetBusinessStatus = createAction(
  '[Admin] Reset Business Status',
  props<{ payload: Update<IBusinesses.IDocument> }>()
);

// Create Business
export const CreateBusiness = createAction(
  '[Admin] Create Business',
  props<{ payload: IBusinesses.ICreate }>()
);
export const CreateBusinessFail = createAction(
  '[Admin] Create Business Fail',
  props<{ payload: any }>()
);
export const CreateBusinessSuccess = createAction(
  '[Admin] Create Business Success',
  props<{ payload: IBusinesses.IDocument }>()
);

// Get Business
export const GetBusiness = createAction(
  '[Admin] Get Business',
  props<{ payload: string }>()
);
export const GetBusinessFail = createAction(
  '[Admin] Get Business Fail',
  props<{ payload: any }>()
);
export const GetBusinessSuccess = createAction(
  '[Admin] Get Business Success',
  props<{ payload: IBusinesses.IDocument }>()
);

// Update Business
export const UpdateBusiness = createAction(
  '[Admin] Update Business',
  props<{ payload: IBusinesses.IDocument }>()
);
export const UpdateBusinessFail = createAction(
  '[Admin] Update Business Fail',
  props<{ payload: any }>()
);
export const UpdateBusinessSuccess = createAction(
  '[Admin] Update Business Success',
  props<{ payload: any }>()
);

// Search Account
export const SearchAccount = createAction(
  '[Admin] Search Account',
  props<{ payload: IBusinesses.ISearch[] }>()
);
export const SearchAccountFail = createAction(
  '[Admin] Search Account Fail',
  props<{ payload: any }>()
);
export const SearchAccountSuccess = createAction(
  '[Admin] Search Account Success',
  props<{
    payload: {
      accounts: IAccount.IDocument[];
      pagination: IBusinesses.IPagination;
    };
  }>()
);

// Assosiate Business Accounts
export const AssosiateBusinessAccounts = createAction(
  '[Admin] Assosiate Business Accounts',
  props<{ payload: IBusinesses.IAssociate }>()
);
export const AssosiateBusinessAccountsFail = createAction(
  '[Admin] Assosiate Business Accounts Fail',
  props<{ payload: any }>()
);
export const AssosiateBusinessAccountsSuccess = createAction(
  '[Admin] Assosiate Business Accounts Success',
  props<{ payload: any }>()
);

// Change Accounts Page
export const ChangeAccountsPage = createAction(
  '[Admin] Change Accounts Page',
  props<{ payload: IBusinesses.IConfig }>()
);

// Reset Search
export const ResetSearch = createAction(
  '[Admin] Reset Search'
);

// Reset Selected Business
export const ResetSelectedBusiness = createAction(
  '[Admin] Reset Selected Business'
);

// redirect
export const RedirectToBusinesses = createAction(
  '[Configuration] Redirect To Businesses'
);

const all = union({
  SetBusinessesPage,
  LoadBusinesses,
  LoadBusinessesFail,
  LoadBusinessesSuccess,
  ActivateBusiness,
  ActivateBusinessFail,
  ActivateBusinessSuccess,
  DeactivateBusiness,
  DeactivateBusinessFail,
  DeactivateBusinessSuccess,
  ResetBusinessStatus,
  ResetSelectedBusiness,
  CreateBusiness,
  CreateBusinessFail,
  CreateBusinessSuccess,
  GetBusiness,
  GetBusinessFail,
  GetBusinessSuccess,
  UpdateBusiness,
  UpdateBusinessFail,
  UpdateBusinessSuccess,
  AssosiateBusinessAccounts,
  AssosiateBusinessAccountsFail,
  AssosiateBusinessAccountsSuccess,
  RedirectToBusinesses
});
const allAccounts = union({
  SearchAccount,
  SearchAccountFail,
  SearchAccountSuccess,
  ChangeAccountsPage,
  ResetSearch
});
export type BusinessesActionsUnion = typeof all;
export type AccountsActionsUnion = typeof allAccounts;
