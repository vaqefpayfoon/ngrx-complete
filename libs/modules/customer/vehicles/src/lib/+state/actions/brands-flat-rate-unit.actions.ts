import { createAction, props, union } from '@ngrx/store';
import { IError } from '@neural/shared/data';

// Models
import { IBrandsFlatRateUnit } from '../../models';

// Get Brands Flat Rate Unit
export const GetBrandsFlatRateUnit = createAction(
  '[Customer] Get Brands Flat Rate Unit'
);
export const GetBrandsFlatRateUnitFail = createAction(
  '[Customer] Get Brands Flat Rate Unit Fail',
  props<{ payload: IError }>()
);
export const GetBrandsFlatRateUnitSuccess = createAction(
  '[Customer] Get Brands Flat Rate Unit Success',
  props<{
    payload: {
      brandsFlatRateUnit: IBrandsFlatRateUnit.IDocument[];
      remainingBrands: string[];
    };
  }>()
);

// Set Brands Flat Rate Unit
export const SetBrandsFlatRateUnit = createAction(
  '[Customer] Set Brands Flat Rate Unit',
  props<{ payload: IBrandsFlatRateUnit.ISetBrandsFru }>()
);
export const SetBrandsFlatRateUnitFail = createAction(
  '[Customer] Set Brands Flat Rate Unit Fail',
  props<{ payload: IError }>()
);
export const SetBrandsFlatRateUnitSuccess = createAction(
  '[Customer] Set Brands Flat Rate Unit Success'
);

const all = union({
  GetBrandsFlatRateUnit,
  GetBrandsFlatRateUnitFail,
  GetBrandsFlatRateUnitSuccess,
  SetBrandsFlatRateUnit,
  SetBrandsFlatRateUnitFail,
  SetBrandsFlatRateUnitSuccess,
});
export type BrandsFlatRateUnitActionsUnion = typeof all;
