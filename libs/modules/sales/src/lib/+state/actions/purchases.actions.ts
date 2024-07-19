import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Purchases
import { IPurchases, ISales } from '../../models';
import { IError } from '@neural/shared/data';
import { ISalesAdvisor } from '@neural/modules/administration';
import { IModels } from '@neural/modules/models';

// Set Purchases Page
export const SetPurchasesPage = createAction(
  '[Hub] Set Purchases Page',
  props<{ payload: ISales.IConfig }>()
);

// Change Purchases Page
export const ChangePurchasesPage = createAction(
  '[Hub] Change Purchases Page',
  props<{ payload: ISales.IConfig }>()
);

// Set Purchases Filters
export const SetPurchasesFilters = createAction(
  '[Hub] Set Purchases Filters',
  props<{ payload: ISales.IFilter }>()
);

// Load Purchases
export const LoadPurchases = createAction('[Hub] Load Purchases');
export const LoadPurchasesFail = createAction(
  '[Hub] Load Purchases Fail',
  props<{ payload: IError }>()
);
export const LoadPurchasesSuccess = createAction(
  '[Hub] Load Purchases Success',
  props<{ sales: IPurchases.IDocument[]; pagination: ISales.IPagination }>()
);

// Get Purchases
export const GetPurchase = createAction(
  '[Hub] Get Purchase',
  props<{ payload: string }>()
);
export const GetPurchaseFail = createAction(
  '[Hub] Get Purchase Fail',
  props<{ payload: IError }>()
);
export const GetPurchaseSuccess = createAction(
  '[Hub] Get Purchase Success',
  props<{ payload: IPurchases.IDocument }>()
);

// Complete Purchases
export const CompletePurchase = createAction(
  '[Hub] Complete Purchases',
  props<{ payload: IPurchases.IDocument }>()
);
export const CompletePurchaseFail = createAction(
  '[Hub] Complete Purchases Fail',
  props<{ payload: IError }>()
);
export const CompletePurchaseSuccess = createAction(
  '[Hub] Complete Purchases Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Cancel Purchases
export const CancelPurchase = createAction(
  '[Hub] Cancel Purchase',
  props<{ payload: IPurchases.IDocument }>()
);
export const CancelPurchaseFail = createAction(
  '[Hub] Cancel Purchase Fail',
  props<{ payload: IError }>()
);
export const CancelPurchaseSuccess = createAction(
  '[Hub] Cancel Purchase Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Update Purchases
export const UpdatePurchase = createAction(
  '[Hub] Update Purchases',
  props<{
    payload: { changes: IPurchases.IUpdate; sale: IPurchases.IDocument };
  }>()
);
export const UpdatePurchaseFail = createAction(
  '[Hub] Update Purchases Fail',
  props<{ payload: IError }>()
);
export const UpdatePurchaseSuccess = createAction(
  '[Hub] Update Purchases Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Reset Selected Purchases
export const ResetSelectedPurchases = createAction(
  '[Hub] Reset Selected Purchases'
);

// redirect
export const RedirectToSales = createAction('[Hub] Redirect To Purchases');

// Get Sales Advisor List
export const GetSalesAdvisor = createAction('[Hub] Get Sales Advisor');
export const GetSalesAdvisorFail = createAction(
  '[Hub] Get Sales Advisor Fail',
  props<{ payload: IError }>()
);
export const GetSalesAdvisorSuccess = createAction(
  '[Hub] Get Sales Advisor Success',
  props<{ payload: ISalesAdvisor.ISADocument[] }>()
);

// Get Brands And Series
export const GetBrandsAndSeries = createAction(
  '[Hub] Get Purchases Brands And Series'
);
export const GetBrandsAndSeriesFail = createAction(
  '[Hub] Get Purchases Brands And Series Fail',
  props<{ payload: any }>()
);
export const GetBrandsAndSeriesSuccess = createAction(
  '[Hub] Get Purchases Brands And Series Success',
  props<{ payload: IModels.IBrand[] }>()
);

// Get Series Models
export const GetSeriesModels = createAction(
  '[Hub] Get Purchases Series Models',
  props<{ brand: string; series: string }>()
);
export const GetSeriesModelsFail = createAction(
  '[Hub] Get Purchases Series Models Fail',
  props<{ payload: any }>()
);
export const GetSeriesModelsSuccess = createAction(
  '[Hub] Get Purchases Series Models Success',
  props<{ payload: IModels.ISeries }>()
);

// Get Series Models
export const GetVariants = createAction(
  '[Hub] Get Purchases Variants',
  props<{ payload: IModels.IVariant }>()
);
export const GetVariantsFail = createAction(
  '[Hub] Get Purchases Variants Fail',
  props<{ payload: any }>()
);
export const GetVariantsSuccess = createAction(
  '[Hub] Get Purchases Variants Success',
  props<{ payload: IModels.IDocument[] }>()
);

//clear sale badge
export const ClearSaleBadge = createAction(
  '[Hub] Clear Sale Badge',
  props<{ payload: IPurchases.IUpdateBadge }>()
);
export const ClearSaleBadgeFail = createAction(
  '[Hub] Clear Sale Badge Fail',
  props<{ payload: IError }>()
);
export const ClearSaleBadgeSuccess = createAction(
  '[Hub] Clear Sale Badge Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

//clear all sale badges
export const ClearAllSaleBadges = createAction(
  '[Hub] Clear All Sale Badges',
  props<{ payload: string }>()
);
export const ClearAllSaleBadgesFail = createAction(
  '[Hub] Clear All Sale Badges Fail',
  props<{ payload: IError }>()
);
export const ClearAllSaleBadgesSuccess = createAction(
  '[Hub] Clear All Sale Badges Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Reset Unit
export const ResetUnit = createAction('[Admin] Reset Purchases Unit');

// Get Global Brands
export const GetGlobalBrands = createAction('[Hub] Get Global Brands');
export const GetGlobalBrandsFail = createAction(
  '[Hub] Get Global Brands Fail',
  props<{ payload: IError }>()
);
export const GetGlobalBrandsSuccess = createAction(
  '[Hub] Get Global Brands Success',
  props<{ payload: string[] }>()
);

// Get Global Models
export const GetGlobalModels = createAction(
  '[Hub] Get Global Models',
  props<{ payload: { brand: string } }>()
);
export const GetGlobalModelsFail = createAction(
  '[Hub] Get Global Models Fail',
  props<{ payload: IError }>()
);
export const GetGlobalModelsSuccess = createAction(
  '[Hub] Get Global Models Success',
  props<{ payload: string[] }>()
);

// Get Global Variants
export const GetGlobalVariants = createAction(
  '[Hub] Get Global Variants',
  props<{ payload: { brand: string; model: string } }>()
);
export const GetGlobalVariantsFail = createAction(
  '[Hub] Get Global Variants Fail',
  props<{ payload: IError }>()
);
export const GetGlobalVariantsSuccess = createAction(
  '[Hub] Get Global Variants Success',
  props<{ payload: string[] }>()
);

// Update Sale Fulfillment
export const UpdatePurchaseFulfillment = createAction(
  '[Hub] Update Purchases Fulfillment',
  props<{
    payload: { uuid: string; fullFillment: IPurchases.ISaleFulfillment };
  }>()
);
export const UpdatePurchaseFulfillmentFail = createAction(
  '[Hub] Update Purchases Fulfillment Fail',
  props<{ payload: IError }>()
);
export const UpdatePurchaseFulfillmentSuccess = createAction(
  '[Hub] Update Purchases Fulfillment Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

const all = union({
  SetPurchasesPage,
  ChangePurchasesPage,
  LoadPurchases,
  LoadPurchasesFail,
  LoadPurchasesSuccess,
  GetPurchase,
  GetPurchaseFail,
  GetPurchaseSuccess,
  CompletePurchase,
  CompletePurchaseFail,
  CompletePurchaseSuccess,
  CancelPurchase,
  CancelPurchaseFail,
  CancelPurchaseSuccess,
  UpdatePurchase,
  UpdatePurchaseFail,
  UpdatePurchaseSuccess,
  SetPurchasesFilters,
  ResetSelectedPurchases,
  RedirectToSales,
  GetSalesAdvisor,
  GetSalesAdvisorFail,
  GetSalesAdvisorSuccess,
  GetBrandsAndSeries,
  GetBrandsAndSeriesFail,
  GetBrandsAndSeriesSuccess,
  GetSeriesModels,
  GetSeriesModelsFail,
  GetSeriesModelsSuccess,
  GetVariants,
  GetVariantsFail,
  GetVariantsSuccess,
  ResetUnit,
  ClearSaleBadge,
  ClearSaleBadgeSuccess,
  ClearSaleBadgeFail,
  ClearAllSaleBadges,
  ClearAllSaleBadgesFail,
  ClearAllSaleBadgesSuccess,
  GetGlobalBrands,
  GetGlobalBrandsFail,
  GetGlobalBrandsSuccess,
  GetGlobalModels,
  GetGlobalModelsFail,
  GetGlobalModelsSuccess,
  GetGlobalVariants,
  GetGlobalVariantsFail,
  GetGlobalVariantsSuccess,
  UpdatePurchaseFulfillment,
  UpdatePurchaseFulfillmentFail,
  UpdatePurchaseFulfillmentSuccess,
});
export type PurchasesActionsUnion = typeof all;
