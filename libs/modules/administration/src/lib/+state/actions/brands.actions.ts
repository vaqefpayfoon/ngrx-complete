import { createAction, props, union } from '@ngrx/store';

// Get Global Brands
export const GetGlobalBrands = createAction('[Admin] Get Global Brands');
export const GetGlobalBrandsFail = createAction(
  '[Admin] Get Global Brands Fail',
  props<{ payload: any }>()
);
export const GetGlobalBrandsSuccess = createAction(
  '[Admin] Get Global Brands Success',
  props<{ payload: string[] }>()
);

const all = union({
  GetGlobalBrands,
  GetGlobalBrandsFail,
  GetGlobalBrandsSuccess,
});
export type BrandsActionsUnion = typeof all;
