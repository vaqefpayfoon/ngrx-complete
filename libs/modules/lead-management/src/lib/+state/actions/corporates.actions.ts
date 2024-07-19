import { createAction, props, union } from '@ngrx/store';

// Models
import { ICorporates } from '../../models';



// Load Corporate
export const LoadCorporate = createAction(
  '[Customer] Load Corporate',
  props<{ payload: string }>()
);
export const LoadCorporateFail = createAction(
  '[Customer] Load Corporate Fail',
  props<{ payload: any }>()
);
export const LoadCorporateSuccess = createAction(
  '[Customer] Load Corporate Success',
  props<{ payload: ICorporates.IDocument }>()
);



const all = union({
  LoadCorporate,
  LoadCorporateFail,
  LoadCorporateSuccess
});
export type CorporatesActionsUnion = typeof all;
