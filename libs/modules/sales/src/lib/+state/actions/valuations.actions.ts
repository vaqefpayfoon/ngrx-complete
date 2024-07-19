import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Valuations
import { IPurchases, ISales } from '../../models';
import { IError } from '@neural/shared/data';

// Set Valuations Page
export const SetValuationsPage = createAction(
  '[Hub] Set Valuations Page',
  props<{ payload: ISales.IConfig }>()
);

// Change Valuations Page
export const ChangeValuationsPage = createAction(
  '[Hub] Change Valuations Page',
  props<{ payload: ISales.IConfig }>()
);

// Set Valuations Filters
export const SetValuationsFilters = createAction(
  '[Hub] Set Valuations Filters',
  props<{ payload: ISales.IFilter }>()
);

// Load Valuations
export const LoadValuations = createAction('[Hub] Load Valuations');
export const LoadValuationsFail = createAction(
  '[Hub] Load Valuations Fail',
  props<{ payload: IError }>()
);
export const LoadValuationsSuccess = createAction(
  '[Hub] Load Valuations Success',
  props<{ sales: IPurchases.IDocument[]; pagination: ISales.IPagination }>()
);

// Get Valuations
export const GetValuation = createAction(
  '[Hub] Get Valuation',
  props<{ payload: string }>()
);
export const GetValuationFail = createAction(
  '[Hub] Get Valuation Fail',
  props<{ payload: IError }>()
);
export const GetValuationSuccess = createAction(
  '[Hub] Get Valuation Success',
  props<{ payload: IPurchases.IDocument }>()
);

// Complete Valuations
export const CompleteValuation = createAction(
  '[Hub] Complete Valuation',
  props<{ payload: IPurchases.IDocument }>()
);
export const CompleteValuationFail = createAction(
  '[Hub] Complete Valuation Fail',
  props<{ payload: IError }>()
);
export const CompleteValuationSuccess = createAction(
  '[Hub] Complete Valuation Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Cancel Valuations
export const CancelValuation = createAction(
  '[Hub] Cancel Valuation',
  props<{ payload: IPurchases.IDocument }>()
);
export const CancelValuationFail = createAction(
  '[Hub] Cancel Valuation Fail',
  props<{ payload: IError }>()
);
export const CancelValuationSuccess = createAction(
  '[Hub] Cancel Valuation Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Update Valuations
export const UpdateValuation = createAction(
  '[Hub] Update Valuations',
  props<{ payload: ISales.IDocument }>()
);
export const UpdateValuationFail = createAction(
  '[Hub] Update Valuations Fail',
  props<{ payload: IError }>()
);
export const UpdateValuationSuccess = createAction(
  '[Hub] Update Valuation Success',
  props<{ payload: Update<IPurchases.IDocument> }>()
);

// Reset Selected Valuation
export const ResetSelectedValuation = createAction(
  '[Hub] Reset Selected Valuation'
);

// redirect
export const RedirectToValuations = createAction('[Hub] Redirect To Valuations');

const all = union({
  SetValuationsPage,
  ChangeValuationsPage,
  LoadValuations,
  LoadValuationsFail,
  LoadValuationsSuccess,
  GetValuation,
  GetValuationFail,
  GetValuationSuccess,
  CompleteValuation,
  CompleteValuationFail,
  CompleteValuationSuccess,
  CancelValuation,
  CancelValuationFail,
  CancelValuationSuccess,
  UpdateValuation,
  UpdateValuationFail,
  UpdateValuationSuccess,
  SetValuationsFilters,
  ResetSelectedValuation,
  RedirectToValuations,
});
export type ValuationsActionsUnion = typeof all;
