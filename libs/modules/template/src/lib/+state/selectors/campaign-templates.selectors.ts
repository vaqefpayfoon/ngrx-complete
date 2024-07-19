import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCampaignTemplates from '../reducers/campaign-templates.reducer';

import { ITemplates } from '../../models';

export const getCampaignTemplatesState = createSelector(
  fromFeature.getTemplateState,
  (state: fromFeature.ITemplatesState) => state.campaignTemplates
);

export const getCampaignTemplatesEntities = createSelector(
  getCampaignTemplatesState,
  fromCampaignTemplates.selectCampaignTemplatesEntities
);

export const getCampaignTemplatesUuids = createSelector(
  getCampaignTemplatesState,
  fromCampaignTemplates.selectCampaignTemplatesUuids
);

export const getCampaignAllTemplates = createSelector(
  getCampaignTemplatesState,
  fromCampaignTemplates.selectAllCampaignTemplates
);

export const getCampaignTemplatesTotals = createSelector(
  getCampaignTemplatesState,
  fromCampaignTemplates.selectCampaignTemplatesTotal
);

export const getCampaignTemplatesTotal = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.total
);

export const getCampaignTemplatesConfig = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.pagination
);

export const getCampaignTemplatesFilter = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.filters
);

export const getCampaignTemplatesPage = createSelector(
  getCampaignTemplatesConfig,
  (pagination): ITemplates.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getCampaignSelectedTemplate = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.selectedCampaignTemplate
);

export const getCampaignTemplatesLoaded = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.loaded
);

export const getCampaignTemplatesLoading = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.loading
);

export const getCampaignTemplatesError = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.error
);

export const getCampaignTemplateImages = createSelector(
  getCampaignTemplatesState,
  (state: fromCampaignTemplates.CampaignTemplatesState) => state.images
);

export const campaignTemplatesQuery = {
  getCampaignTemplatesUuids,
  getCampaignTemplatesEntities,
  getCampaignAllTemplates,
  getCampaignTemplatesTotal,
  getCampaignTemplatesTotals,
  getCampaignTemplatesConfig,
  getCampaignTemplatesFilter,
  getCampaignTemplatesPage,
  getCampaignSelectedTemplate,
  getCampaignTemplatesLoaded,
  getCampaignTemplatesLoading,
  getCampaignTemplatesError,
  getCampaignTemplateImages
};
