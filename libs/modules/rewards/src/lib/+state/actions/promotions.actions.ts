import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IPromotions } from '../../models';
import { IError } from '@neural/shared/data';
import { Auth } from '@neural/auth';
import { IVehicle } from '@neural/modules/customer/vehicles';

// Set Promotions Page
export const SetPromotionsPage = createAction(
  '[Admin] Set Promotions Page',
  props<{ payload: IPromotions.IConfig }>()
);

// Change Promotions Page
export const ChangePromotionsPage = createAction(
  '[Admin] Change Promotions Page',
  props<{ payload: IPromotions.IConfig }>()
);

// Set Promotions Filters
export const SetPromotionsFilters = createAction(
  '[Admin] Set Promotions Filters',
  props<{ payload: IPromotions.IFilter }>()
);

// Load Promotions
export const LoadPromotions = createAction('[Admin] Load Promotions');
export const LoadPromotionsFail = createAction(
  '[Admin] Load Promotions Fail',
  props<{ payload: IError }>()
);
export const LoadPromotionsSuccess = createAction(
  '[Admin] Load Promotions Success',
  props<{
    promotions: IPromotions.IDocument[];
    pagination: IPromotions.IPagination;
  }>()
);

// Create Promotions
export const CreatePromotion = createAction(
  '[Admin] Create Promotion',
  props<{ payload: IPromotions.ICreate }>()
);
export const CreatePromotionFail = createAction(
  '[Admin] Create Promotion Fail',
  props<{ payload: IError }>()
);
export const CreatePromotionSuccess = createAction(
  '[Admin] Create Promotion Success',
  props<{ payload: IPromotions.IDocument }>()
);

// Update Promotion
export const UpdatePromotion = createAction(
  '[Admin] Update Promotion',
  props<{ payload: IPromotions.IDocument }>()
);
export const UpdatePromotionFail = createAction(
  '[Admin] Update Promotion Fail',
  props<{ payload: IError }>()
);
export const UpdatePromotionSuccess = createAction(
  '[Admin] Update Promotion Success',
  props<{ payload: Update<IPromotions.IDocument> }>()
);

// Activate Promotions
export const ActivatePromotion = createAction(
  '[Admin] Activate Promotion',
  props<{ payload: IPromotions.IDocument }>()
);
export const ActivatePromotionFail = createAction(
  '[Admin] Activate Promotion Fail',
  props<{ payload: IError }>()
);
export const ActivatePromotionsSuccess = createAction(
  '[Admin] Activate Promotion Success',
  props<{ payload: Update<IPromotions.IDocument> }>()
);

// Deactivate Promotions
export const DeactivatePromotion = createAction(
  '[Admin] Deactivate Promotion',
  props<{ payload: IPromotions.IDocument }>()
);
export const DeactivatePromotionFail = createAction(
  '[Admin] Deactivate Promotion Fail',
  props<{ payload: IError }>()
);
export const DeactivatePromotionSuccess = createAction(
  '[Admin] Deactivate Promotion Success',
  props<{ payload: Update<IPromotions.IDocument> }>()
);

// Get Promotion
export const GetPromotion = createAction(
  '[Admin] Get Promotion',
  props<{ payload: string }>()
);
export const GetPromotionFail = createAction(
  '[Admin] Get Promotion Fail',
  props<{ payload: IError }>()
);
export const GetPromotionSuccess = createAction(
  '[Admin] Get Promotion Success',
  props<{
    payload: IPromotions.IDocument;
    vehicles?: any;
    accounts?: any;
  }>()
);

// Reset Promotion Status
export const ResetPromotionStatus = createAction(
  '[Admin] Reset Promotion Status',
  props<{ payload: Update<IPromotions.IDocument> }>()
);

// Reset Promotion Redeem
export const ResetPromotionRedeem = createAction(
  '[Admin] Reset Promotion Redeem',
  props<{ payload: Update<IPromotions.IDocument> }>()
);

// Reset Selected Promotion
export const ResetSelectedPromotion = createAction(
  '[Admin] Reset Selected Promotion'
);

// Reset Loaded Promotions
export const ResetLoadedPromotions = createAction(
  '[Admin] Reset Loaded Promotions'
);

// redirect
export const RedirectToPromotions = createAction(
  '[Admin] Redirect To Promotions'
);

// Code Validation
export const CodeValidation = createAction(
  '[Admin] Check Code Validity',
  props<{ payload: IPromotions.ICodeValidation }>()
);

export const CodeValidationSuccess = createAction(
  '[Admin] Check Code Validity Success',
  props<{ payload: string }>()
);

export const CodeValidationFail = createAction(
  '[Admin] Check Code Validity Fail',
  props<{ payload: IError }>()
);

// Get Account
export const GetAccountByEmail = createAction(
  '[Admin] Get Account By Email',
  props<{ payload: string }>()
);
export const GetAccountByEmailFail = createAction(
  '[Admin] Get Account By Email Fail',
  props<{ payload: IError }>()
);
export const GetAccountByEmailSuccess = createAction(
  '[Admin] Get Account By Email Success',
  props<{ payload: Auth.IAccount }>()
);

// Get Brands
export const GetBrands = createAction('[Admin] Get Brands');
export const GetBrandsFail = createAction(
  '[Admin] Get Brands Fail',
  props<{ payload: IError }>()
);
export const GetBrandsSuccess = createAction(
  '[Admin] Get Brands Success',
  props<{ payload: IPromotions.IBrand[] }>()
);

// Activate Redeem
export const ActivateRedeemPromotion = createAction(
  '[Admin] Activate Redeem Promotion',
  props<{ payload: IPromotions.IDocument }>()
);
export const ActivateRedeemPromotionFail = createAction(
  '[Admin] Activate Redeem Promotion Fail',
  props<{ payload: IError }>()
);
export const ActivateRedeemPromotionsSuccess = createAction(
  '[Admin] Activate Redeem Promotion Success',
  props<{ payload: Update<IPromotions.IDocument> }>()
);

// Deactivate Redeem
export const DeactivateRedeemPromotion = createAction(
  '[Admin] Deactivate Redeem Promotion',
  props<{ payload: IPromotions.IDocument }>()
);
export const DeactivateRedeemPromotionFail = createAction(
  '[Admin] Deactivate Redeem Promotion Fail',
  props<{ payload: IError }>()
);
export const DeactivateRedeemPromotionSuccess = createAction(
  '[Admin] Deactivate Redeem Promotion Success',
  props<{ payload: Update<IPromotions.IDocument> }>()
);

export const GetInboxAccounts = createAction(
  '[Admin] Get Inbox Accounts',
  props<{ payload: IPromotions.IFilter }>()
);
export const GetInboxAccountsFail = createAction(
  '[Admin] Get Inbox Accounts Fail',
  props<{ payload: IError }>()
);
export const GetInboxAccountsSuccess = createAction(
  '[Admin] Get Inbox Accounts Success',
  props<{ payload: Auth.IAccount[] }>()
);

export const LoadVehicles = createAction(
  '[Admin] Load Vehicles',
  props<{ payload: IVehicle.IFilter }>()
);
export const LoadVehiclesFail = createAction(
  '[Admin] Load Vehicles Fail',
  props<{ payload: any }>()
);
export const LoadVehiclesSuccess = createAction(
  '[Admin] Load Vehicles Success',
  props<{ payload: IVehicle.IDocument[] }>()
);

export const ResetFilters = createAction(
  '[Admin] Reset Account And Vehicle Filters'
);

const all = union({
  SetPromotionsPage,
  ChangePromotionsPage,
  SetPromotionsFilters,
  LoadPromotions,
  LoadPromotionsFail,
  LoadPromotionsSuccess,
  CreatePromotion,
  CreatePromotionFail,
  CreatePromotionSuccess,
  UpdatePromotion,
  UpdatePromotionFail,
  UpdatePromotionSuccess,
  ActivatePromotion,
  ActivatePromotionFail,
  ActivatePromotionsSuccess,
  DeactivatePromotion,
  DeactivatePromotionFail,
  DeactivatePromotionSuccess,
  GetPromotion,
  GetPromotionFail,
  GetPromotionSuccess,
  ResetPromotionStatus,
  ResetLoadedPromotions,
  RedirectToPromotions,
  CodeValidation,
  CodeValidationSuccess,
  CodeValidationFail,
  GetAccountByEmail,
  GetAccountByEmailFail,
  GetAccountByEmailSuccess,
  GetBrands,
  GetBrandsFail,
  GetBrandsSuccess,
  ActivateRedeemPromotion,
  ActivateRedeemPromotionFail,
  ActivateRedeemPromotionsSuccess,
  DeactivateRedeemPromotion,
  DeactivateRedeemPromotionFail,
  DeactivateRedeemPromotionSuccess,
  ResetPromotionRedeem,
  GetInboxAccounts,
  GetInboxAccountsFail,
  GetInboxAccountsSuccess,
  LoadVehicles,
  LoadVehiclesSuccess,
  LoadVehiclesFail,
  ResetFilters,
});
export type PromotionsActionsUnion = typeof all;
