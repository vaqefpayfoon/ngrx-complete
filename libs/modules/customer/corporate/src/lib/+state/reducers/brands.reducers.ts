import { createReducer, on } from '@ngrx/store';

import { BrandsActions } from '../actions';

export interface BrandsState {
  brands: string[] | null;
}

export const initialState: BrandsState = {
  brands: null,
};

const brandReducer = createReducer(
  initialState,

  on(BrandsActions.GetGlobalBrandsSuccess, (state, { payload }) => {
    const brands = payload;
    return {
      ...state,
      brands,
    };
  })
);

export function reducer(
  state: BrandsState | undefined,
  action: BrandsActions.BrandsActionsUnion
) {
  return brandReducer(state, action);
}
