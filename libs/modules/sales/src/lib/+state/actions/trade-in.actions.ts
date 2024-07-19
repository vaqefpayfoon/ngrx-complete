import { createAction, props, union } from '@ngrx/store';

import { ITradeIn } from '../../models';

import { IBody, IError, IRequest } from '@neural/shared/data';

// Update TradeIn
export const CreateTradeIn = createAction(
  '[Hub] Create TradeIn',
  props<{
    payload: IRequest<ITradeIn.ICreate>;
  }>()
);
export const CreateTradeInFail = createAction(
  '[Hub] Create TradeIn Fail',
  props<{ payload: IError }>()
);
export const CreateTradeInSuccess = createAction(
  '[Hub] Create TradeIn Success',
  props<{ payload: ITradeIn.ITradeInDocumnet }>()
);

// Update TradeIn
export const UpdateTradeIn = createAction(
  '[Hub] Update TradeIn',
  props<{
    payload: IBody<ITradeIn.ITradeInDocumnet, ITradeIn.IUpdate>;
  }>()
);
export const UpdateTradeInFail = createAction(
  '[Hub] Update TradeIn Fail',
  props<{ payload: IError }>()
);
export const UpdateTradeInSuccess = createAction(
  '[Hub] Update TradeIn Success',
  props<{ payload: ITradeIn.ITradeInDocumnet }>()
);

const all = union({
  CreateTradeIn,
  CreateTradeInFail,
  CreateTradeInSuccess,
  UpdateTradeIn,
  UpdateTradeInFail,
  UpdateTradeInSuccess,
});
export type TradeInActionsUnion = typeof all;
