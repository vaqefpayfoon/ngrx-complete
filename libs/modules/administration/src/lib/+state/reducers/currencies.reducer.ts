import { createReducer, on } from '@ngrx/store';

import { CurrenciesActions } from '../actions';

export interface CurrenciesState {
  data: string[];
  loaded: boolean;
  loading: boolean;
}

export const initialState = {
  data: [],
  loaded: false,
  loading: false
};

const currenciesReducer = createReducer(
  initialState,

  on(CurrenciesActions.LoadCurrencies, state => ({
    ...state,
    loading: true
  })),

  on(CurrenciesActions.LoadCurrenciesSuccess, (state, { payload }) => {
    const data = payload;

    return {
      ...state,
      loaded: true,
      loading: false,
      data
    };
  }),

  on(CurrenciesActions.LoadCurrenciesFail, state => {
    return {
      ...state,
      loading: false,
      loaded: false
    };
  })
);

export function reducer(
  state: CurrenciesState | undefined,
  action: CurrenciesActions.CurrenciesActionsUnion
) {
  return currenciesReducer(state, action);
}
