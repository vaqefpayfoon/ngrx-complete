import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Sales
import { ISales } from '../../models';
import { IError } from '@neural/shared/data';
import { Auth } from '@neural/auth';

// Set Sales Page
export const SetSalesPage = createAction(
  '[Hub] Set Sales Page',
  props<{ payload: ISales.IConfig }>()
);

// Change Sales Page
export const ChangeSalesPage = createAction(
  '[Hub] Change Sales Page',
  props<{ payload: ISales.IConfig }>()
);

// Set Sales Filters
export const SetSalesFilters = createAction(
  '[Hub] Set Sales Filters',
  props<{ payload: ISales.IFilter }>()
);

// Load Sales
export const LoadSales = createAction('[Hub] Load Sales');
export const LoadSalesFail = createAction(
  '[Hub] Load Sales Fail',
  props<{ payload: IError }>()
);
export const LoadSalesSuccess = createAction(
  '[Hub] Load Sales Success',
  props<{ sales: ISales.IDocument[]; pagination: ISales.IPagination }>()
);

// Get Sales
export const GetSale = createAction(
  '[Hub] Get Sales',
  props<{ payload: string }>()
);
export const GetSaleFail = createAction(
  '[Hub] Get Sales Fail',
  props<{ payload: IError }>()
);
export const GetSaleSuccess = createAction(
  '[Hub] Get Sales Success',
  props<{ payload: ISales.IDocument }>()
);

// Complete Sale
export const CompleteSale = createAction(
  '[Hub] Complete Sale',
  props<{ payload: ISales.IDocument }>()
);
export const CompleteSaleFail = createAction(
  '[Hub] Complete Sale Fail',
  props<{ payload: IError }>()
);
export const CompleteSaleSuccess = createAction(
  '[Hub] Complete Sale Success',
  props<{ payload: Update<ISales.IDocument> }>()
);

// Cancel Sale
export const CancelSale = createAction(
  '[Hub] Cancel Sale',
  props<{ payload: ISales.IDocument }>()
);
export const CancelSaleFail = createAction(
  '[Hub] Cancel Sale Fail',
  props<{ payload: IError }>()
);
export const CancelSaleSuccess = createAction(
  '[Hub] Cancel Sale Success',
  props<{ payload: Update<ISales.IDocument> }>()
);

// Get Sales
export const GetSaleAdvisors = createAction('[Hub] Get Sale Advisors');
export const GetSaleAdvisorsFail = createAction(
  '[Hub] Get Sale Advisors Fail',
  props<{ payload: IError }>()
);
export const GetSaleAdvisorsSuccess = createAction(
  '[Hub] Get Sale Advisors Success',
  props<{ payload: Auth.IAccount[] }>()
);

// Update Sale
export const UpdateSale = createAction(
  '[Hub] Update Sale',
  props<{ payload: { changes: ISales.IUpdate; sale: ISales.IDocument } }>()
);
export const UpdateSaleFail = createAction(
  '[Hub] Update Sale Fail',
  props<{ payload: IError }>()
);
export const UpdateSaleSuccess = createAction(
  '[Hub] Update Sale Success',
  props<{ payload: Update<ISales.IDocument> }>()
);

// Update Sale Fulfillment
export const UpdateSaleFulfillment = createAction(
  '[Hub] Update Sale Fulfillment',
  props<{
    payload: { sale: ISales.IDocument; fullFillment: ISales.ISaleFulfillment };
  }>()
);
export const UpdateSaleFulfillmentFail = createAction(
  '[Hub] Update Sale Fulfillment Fail',
  props<{ payload: IError }>()
);
export const UpdateSaleFulfillmentSuccess = createAction(
  '[Hub] Update Sale Fulfillment Success',
  props<{ payload: Update<ISales.IDocument> }>()
);

// Reset Selected Sale
export const ResetSelectedSale = createAction('[Hub] Reset Selected Sale');

// redirect
export const RedirectToSales = createAction('[Hub] Redirect To Sales');

const all = union({
  SetSalesPage,
  ChangeSalesPage,
  LoadSales,
  LoadSalesFail,
  LoadSalesSuccess,
  GetSale,
  GetSaleFail,
  GetSaleSuccess,
  CompleteSale,
  CompleteSaleFail,
  CompleteSaleSuccess,
  CancelSale,
  CancelSaleFail,
  CancelSaleSuccess,
  GetSaleAdvisors,
  GetSaleAdvisorsFail,
  GetSaleAdvisorsSuccess,
  UpdateSale,
  UpdateSaleFail,
  UpdateSaleSuccess,
  UpdateSaleFulfillment,
  UpdateSaleFulfillmentFail,
  UpdateSaleFulfillmentSuccess,
  SetSalesFilters,
  ResetSelectedSale,
  RedirectToSales,
});
export type SalesActionsUnion = typeof all;
