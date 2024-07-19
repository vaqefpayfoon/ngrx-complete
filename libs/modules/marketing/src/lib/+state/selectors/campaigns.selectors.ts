import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCampaigns from '../reducers/campaigns.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ICampaigns } from '../../models';

export const getCampaignsState = createSelector(
  fromFeature.getMarketingState,
  (state: fromFeature.ICampaignsState) => state.campaigns
);

export const getCampaignsEntities = createSelector(
  getCampaignsState,
  fromCampaigns.selectCampaignsEntities
);

export const getCampaignsUuids = createSelector(
  getCampaignsState,
  fromCampaigns.selectCampaignsUuids
);

export const getAllCampaigns = createSelector(
  getCampaignsState,
  fromCampaigns.selectAllCampaigns
);

export const getCampaignsTotals = createSelector(
  getCampaignsState,
  fromCampaigns.selectCampaignsTotal
);

export const getCampaignsTotal = createSelector(
  getCampaignsState,
  (state: fromCampaigns.CampaignsState) => state.total
);

export const getCampaignsConfig = createSelector(
  getCampaignsState,
  (state: fromCampaigns.CampaignsState) => state.pagination
);

export const getCampaignsPage = createSelector(
  getCampaignsConfig,
  (pagination): ICampaigns.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page,name:pagination.name,active:pagination.active,_id:pagination._id }
      : { limit: 10, page: 1,name:'',_id:1,active:false };
  }
);

export const getSelectedCampaign = createSelector(
  getCampaignsState,
  (state: fromCampaigns.CampaignsState) => state.selectedCampaign
);

export const getCampaignsLoaded = createSelector(
  getCampaignsState,
  (state: fromCampaigns.CampaignsState) => state.loaded
);

export const getCampaignsLoading = createSelector(
  getCampaignsState,
  (state: fromCampaigns.CampaignsState) => state.loading
);

export const getCampaignsError = createSelector(
  getCampaignsState,
  (state: fromCampaigns.CampaignsState) => state.error
);

export const getCampaignContentImages = createSelector(
  getCampaignsState,
  (state: fromCampaigns.CampaignsState) => state.images
);

export const campaignsQuery = {
  getCampaignsUuids,
  getCampaignsEntities,
  getAllCampaigns,
  getCampaignsTotal,
  getCampaignsTotals,
  getCampaignsConfig,
  getCampaignsPage,
  getSelectedCampaign,
  getCampaignsLoaded,
  getCampaignsLoading,
  getCampaignsError,
  getCampaignContentImages
};
