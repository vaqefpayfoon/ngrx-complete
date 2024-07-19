import { createAction, props, union } from '@ngrx/store';

// Load Currencies
export const LoadCurrencies = createAction('[Admin] Load Currencies');
export const LoadCurrenciesFail = createAction(
  '[Admin] Load Currencies Fail',
  props<{ payload: any }>()
);
export const LoadCurrenciesSuccess = createAction(
  '[Admin] Load Currencies Success',
  props<{ payload: string[] }>()
);

const all = union({
  LoadCurrencies,
  LoadCurrenciesFail,
  LoadCurrenciesSuccess
});
export type CurrenciesActionsUnion = typeof all;
