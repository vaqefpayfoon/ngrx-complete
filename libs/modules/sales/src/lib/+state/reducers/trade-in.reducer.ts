import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { TradeInActions } from '../actions';

import { ITradeIn } from '../../models';

export interface TradeInState extends EntityState<ITradeIn.ITradeInDocumnet> {
  total: number;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<ITradeIn.ITradeInDocumnet> = createEntityAdapter<
  ITradeIn.ITradeInDocumnet
>({
  selectId: (tradeIn) => tradeIn.uuid,
});

export const initialState: TradeInState = adapter.getInitialState({
  total: 0,
  loaded: false,
  loading: false,
  error: null,
});

const tradeInReducer = createReducer(
  initialState,
  on(TradeInActions.CreateTradeInSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(TradeInActions.UpdateTradeInSuccess, (state, { payload }) => {
    return adapter.upsertOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  })
);

export function reducer(
  state: TradeInState | undefined,
  action: TradeInActions.TradeInActionsUnion
) {
  return tradeInReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Sales uuids
export const selectTradeInsUuids = selectIds;

// select the dictionary of Sales entities
export const selectTradeInsEntities = selectEntities;

// select the array of Sales
export const selectAllTradeIns = selectAll;

// select the total Sales count
export const selectTradeInsTotal = selectTotal;
