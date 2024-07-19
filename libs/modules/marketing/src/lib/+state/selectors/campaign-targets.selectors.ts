import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCampaignTargets from '../reducers/campaign-targets.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ICampaignTargets } from '../../models';

export const getCampaignTargetsState = createSelector(
  fromFeature.getMarketingState,
  (state: fromFeature.ICampaignsState) => state.campaignTargets
);

export const getCampaignTargetsEntities = createSelector(
  getCampaignTargetsState,
  fromCampaignTargets.selectCampaignTargetsEntities
);

export const getCampaignTargetsUuids = createSelector(
  getCampaignTargetsState,
  fromCampaignTargets.selectCampaignTargetsUuids
);

export const getAllCampaignTargets = createSelector(
  getCampaignTargetsState,
  fromCampaignTargets.selectAllCampaignTargets
);

export const getCampaignTargetsTotals = createSelector(
  getCampaignTargetsState,
  fromCampaignTargets.selectCampaignTargetsTotal
);

export const getCampaignTargetsTotal = createSelector(
  getCampaignTargetsState,
  (state: fromCampaignTargets.CampaignTargetsState) => state.total
);

export const getCampaignTargetsConfig = createSelector(
  getCampaignTargetsState,
  (state: fromCampaignTargets.CampaignTargetsState) => state.pagination
);

export const getCampaignTargetsFilter = createSelector(
  getCampaignTargetsState,
  (state: fromCampaignTargets.CampaignTargetsState) => state.filters
);

export const getCampaignTargetsLoaded = createSelector(
  getCampaignTargetsState,
  (state: fromCampaignTargets.CampaignTargetsState) => state.loaded
);

export const getCampaignTargetsLoading = createSelector(
  getCampaignTargetsState,
  (state: fromCampaignTargets.CampaignTargetsState) => state.loading
);

export const getCampaignTargetsError = createSelector(
  getCampaignTargetsState,
  (state: fromCampaignTargets.CampaignTargetsState) => state.error
);

export const campaignTargetsQuery = {
  getCampaignTargetsState,
  getCampaignTargetsEntities,
  getCampaignTargetsUuids,
  getAllCampaignTargets,
  getCampaignTargetsTotals,
  getCampaignTargetsTotal,
  getCampaignTargetsConfig,
  getCampaignTargetsFilter,
  getCampaignTargetsLoaded,
  getCampaignTargetsLoading,
  getCampaignTargetsError
};
