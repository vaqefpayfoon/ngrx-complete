import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPromotions from '../reducers/promotions.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IPromotions } from '../../models';

export const getPromotionsState = createSelector(
  fromFeature.getRewardsState,
  (state: fromFeature.IRewardsState) => state.promotions
);

export const getPromotionsEntities = createSelector(
  getPromotionsState,
  fromPromotions.selectPromotionsEntities
);

export const getPromotionsUuids = createSelector(
  getPromotionsState,
  fromPromotions.selectPromotionsUuids
);

export const getAllPromotions = createSelector(
  getPromotionsState,
  fromPromotions.selectAllPromotions
);

export const getPromotionsTotals = createSelector(
  getPromotionsState,
  fromPromotions.selectPromotionsTotal
);

export const getPromotionsTotal = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.total
);

export const getPromotionsConfig = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.pagination
);

export const getPromotionsFilters = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.filters
);

export const getPromotionsSorts = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.sorts
);

export const getPromotionsPage = createSelector(
  getPromotionsConfig,
  (pagination): IPromotions.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedPromotion = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.selectedPromotion
);

export const getCodeValidity = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.codeValidity
);


export const getBrands = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.brands
);

export const getPromotionsLoaded = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.loaded
);

export const getPromotionsLoading = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.loading
);

export const getPromotionsError = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.error
);

export const getSearchedAccountEntities = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.accounts
);

export const getSearchedAccount = createSelector(
  getSearchedAccountEntities,
  (entities) =>
    entities ? Object.keys(entities).map((uuid) => entities[uuid]) : []
);



export const getVehicles = createSelector(
  getPromotionsState,
  (state: fromPromotions.PromotionsState) => state.vehicles
);

export const getSearchedVehicle = createSelector(
  getVehicles,
  (entities) =>
    entities ? Object.keys(entities).map((uuid) => entities[uuid]) : []
);

export const promotionsQuery = {
  getPromotionsUuids,
  getPromotionsEntities,
  getAllPromotions,
  getPromotionsTotal,
  getPromotionsTotals,
  getPromotionsConfig,
  getPromotionsPage,
  getSelectedPromotion,
  getPromotionsLoaded,
  getPromotionsLoading,
  getPromotionsError,
  getPromotionsFilters,
  getPromotionsSorts,
  getCodeValidity,
  getBrands,
  getSearchedAccount,
  getSearchedVehicle
};
