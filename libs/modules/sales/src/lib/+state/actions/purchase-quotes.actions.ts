import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Purchase Quotes
import { IPurchases, ISales } from '../../models';
import { IError } from '@neural/shared/data';
import { ISalesAdvisor } from '@neural/modules/administration';
import { IModels } from '@neural/modules/models';

// Set Purchase Quotes Page
export const SetPurchaseQuotesPage = createAction(
  '[Hub] Set Purchase Quotes Page',
  props<{ payload: ISales.IConfig }>()
);

// Change Purchase Quotes Page
export const ChangePurchaseQuotesPage = createAction(
  '[Hub] Change Purchase Quotes Page',
  props<{ payload: ISales.IConfig }>()
);

// Set Purchase Quotes Filters
export const SetPurchaseQuotesFilters = createAction(
  '[Hub] Set Purchase Quotes Filters',
  props<{ payload: ISales.IFilter }>()
);

// Load Purchase Quotes
export const LoadPurchaseQuotes = createAction('[Hub] Load Purchase Quotes');
export const LoadPurchaseQuotesFail = createAction(
  '[Hub] Load Purchase Quotes Fail',
  props<{ payload: IError }>()
);
export const LoadPurchaseQuotesSuccess = createAction(
  '[Hub] Load Purchase Quotes Success',
  props<{ sales: IPurchases.IDocument[]; pagination: ISales.IPagination }>()
);

// Get Purchase Quotes
export const GetPurchaseQuote = createAction(
  '[Hub] Get Purchase Quote',
  props<{ payload: string }>()
);
export const GetPurchaseQuoteFail = createAction(
  '[Hub] Get Purchase Quote Fail',
  props<{ payload: IError }>()
);
export const GetPurchaseQuoteSuccess = createAction(
  '[Hub] Get Purchase Quote Success',
  props<{ payload: IPurchases.IDocument }>()
)

// Update Purchase Quotes
export const UpdatePurchaseQuote = createAction(
  '[Hub] Update Purchase Quote',
  props<{
    payload: { changes: IPurchases.IUpdate; sale: IPurchases.IDocument };
  }>()
);
export const UpdatePurchaseQuoteFail = createAction(
  '[Hub] Update Purchase Quote Fail',
  props<{ payload: IError }>()
);
export const UpdatePurchaseQuoteSuccess = createAction(
  '[Hub] Update Purchase Quote Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Reset Selected Purchase Quotes
export const ResetSelectedPurchaseQuote = createAction(
  '[Hub] Reset Selected Purchase Quote'
);

// redirect
export const RedirectToPurchaseQuote = createAction(
  '[Hub] Redirect To Purchase Quote'
);

// Get Sales Advisor List
export const GetSalesAdvisor = createAction(
  '[Hub] Get Sales Advisor For Purchase Quote'
);
export const GetSalesAdvisorFail = createAction(
  '[Hub] Get Sales Advisor For Purchase Quote Fail',
  props<{ payload: IError }>()
);
export const GetSalesAdvisorSuccess = createAction(
  '[Hub] Get Sales Advisor For Purchase Quote Success',
  props<{ payload: ISalesAdvisor.ISADocument[] }>()
);

// Get Brands And Series
export const GetBrandsAndSeries = createAction(
  '[Hub] Get Purchases Brands And Series For Purchase Quote'
);
export const GetBrandsAndSeriesFail = createAction(
  '[Hub] Get Purchases Brands And Series For Purchase Quote Fail',
  props<{ payload: any }>()
);
export const GetBrandsAndSeriesSuccess = createAction(
  '[Hub] Get Purchases Brands And Series For Purchase Quote Success',
  props<{ payload: IModels.IBrand[] }>()
);

// Get Series Models
export const GetSeriesModels = createAction(
  '[Hub] Get Purchases Series Models For Purchase Quote',
  props<{ brand: string; series: string }>()
);
export const GetSeriesModelsFail = createAction(
  '[Hub] Get Purchases Series Models For Purchase Quote Fail',
  props<{ payload: any }>()
);
export const GetSeriesModelsSuccess = createAction(
  '[Hub] Get Purchases Series Models For Purchase Quote Success',
  props<{ payload: IModels.ISeries }>()
);

// Get Series variants
export const GetVariants = createAction(
  '[Hub] Get Purchases Variants For Purchase Quote',
  props<{ payload: IModels.IVariant }>()
);
export const GetVariantsFail = createAction(
  '[Hub] Get Purchases Variants For Purchase Quote Fail',
  props<{ payload: any }>()
);
export const GetVariantsSuccess = createAction(
  '[Hub] Get Purchases Variants For Purchase Quote Success',
  props<{ payload: IModels.IDocument[] }>()
);

//clear sale badge
export const ClearSaleBadge = createAction(
  '[Hub] Clear Sale Badge For Purchase Quote',
  props<{ payload: IPurchases.IUpdateBadge }>()
);
export const ClearSaleBadgeFail = createAction(
  '[Hub] Clear Sale Badge For Purchase Quote Fail',
  props<{ payload: IError }>()
);
export const ClearSaleBadgeSuccess = createAction(
  '[Hub] Clear Sale Badge For Purchase Quote Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

//clear all sale badges
export const ClearAllSaleBadges = createAction(
  '[Hub] Clear All Sale Badges For Purchase Quote',
  props<{ payload: string }>()
);
export const ClearAllSaleBadgesFail = createAction(
  '[Hub] Clear All Sale Badges For Purchase Quote Fail',
  props<{ payload: IError }>()
);
export const ClearAllSaleBadgesSuccess = createAction(
  '[Hub] Clear All Sale Badges For Purchase Quote Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Reset Unit
export const ResetUnit = createAction(
  '[Admin] Reset Purchases Unit For Purchase Quote'
);

// Get Global Brands
export const GetGlobalBrands = createAction(
  '[Hub] Get Global Brands For Purchase Quote'
);
export const GetGlobalBrandsFail = createAction(
  '[Hub] Get Global Brands For Purchase Quote Fail',
  props<{ payload: IError }>()
);
export const GetGlobalBrandsSuccess = createAction(
  '[Hub] Get Global Brands For Purchase Quote Success',
  props<{ payload: string[] }>()
);

// Get Global Models
export const GetGlobalModels = createAction(
  '[Hub] Get Global Models For Purchase Quote',
  props<{ payload: { brand: string } }>()
);
export const GetGlobalModelsFail = createAction(
  '[Hub] Get Global Models For Purchase Quote Fail',
  props<{ payload: IError }>()
);
export const GetGlobalModelsSuccess = createAction(
  '[Hub] Get Global Models For Purchase Quote Success',
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

const all = union({
  SetPurchaseQuotesPage,
  ChangePurchaseQuotesPage,
  SetPurchaseQuotesFilters,
  LoadPurchaseQuotes,
  LoadPurchaseQuotesFail,
  LoadPurchaseQuotesSuccess,
  GetPurchaseQuote,
  GetPurchaseQuoteFail,
  GetPurchaseQuoteSuccess,
  UpdatePurchaseQuote,
  UpdatePurchaseQuoteFail,
  UpdatePurchaseQuoteSuccess,
  ResetSelectedPurchaseQuote,
  RedirectToPurchaseQuote,
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
  ClearSaleBadge,
  ClearSaleBadgeFail,
  ClearSaleBadgeSuccess,
  ClearAllSaleBadges,
  ClearAllSaleBadgesFail,
  ClearAllSaleBadgesSuccess,
  ResetUnit,
  GetGlobalBrands,
  GetGlobalBrandsFail,
  GetGlobalBrandsSuccess,
  GetGlobalModels,
  GetGlobalModelsFail,
  GetGlobalModelsSuccess,
  GetGlobalVariants,
  GetGlobalVariantsFail,
  GetGlobalVariantsSuccess,
});
export type PurchaseQuotesActionsUnion = typeof all;
