import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromPromotions from './promotions.reducer';

export interface IRewardsState {
  readonly promotions: fromPromotions.PromotionsState;
}

export const REDUCERS: ActionReducerMap<IRewardsState> = {
  promotions: fromPromotions.reducer
};

export const getRewardsState = createFeatureSelector<IRewardsState>(
  'rewards'
);
