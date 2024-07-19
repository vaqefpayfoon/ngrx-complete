import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { BrandsFlatRateUnitActions } from '../actions';

import { IBrandsFlatRateUnit } from '../../models';

export interface BrandsFlatRateUnitState {
  brandsFlatRateUnit: IBrandsFlatRateUnit.IDocument[];
  remainingBrands: string[];
  total: number;
  pending: number;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: BrandsFlatRateUnitState = {
  brandsFlatRateUnit: null,
  remainingBrands: null,
  total: 0,
  pending: 0,
  loaded: false,
  loading: false,
  error: null,
};

export const BrandsFlatRateUnitReducer = createReducer(
  initialState,

  on(BrandsFlatRateUnitActions.GetBrandsFlatRateUnit, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),

  on(
    BrandsFlatRateUnitActions.GetBrandsFlatRateUnitFail,
    (state, { payload }) => {
      const error = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        error,
      };
    }
  ),

  on(
    BrandsFlatRateUnitActions.GetBrandsFlatRateUnitSuccess,
    (state, { payload: { brandsFlatRateUnit, remainingBrands } }) => {
      const total = brandsFlatRateUnit.length;
      const pending = remainingBrands.length;
      return {
        ...state,
        brandsFlatRateUnit,
        remainingBrands,
        total,
        pending,
        loading: false,
        loaded: true,
        error: null,
      };
    }
  )
);

export function reducer(
  state: BrandsFlatRateUnitState | undefined,
  action: BrandsFlatRateUnitActions.BrandsFlatRateUnitActionsUnion
) {
  return BrandsFlatRateUnitReducer(state, action);
}
