import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromMasterTemplates from '../reducers/master-templates.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ITemplates } from '../../models';

export const getMasterTemplatesState = createSelector(
  fromFeature.getTemplateState,
  (state: fromFeature.ITemplatesState) => state.masterHtmlTemplates
);

export const getMasterTemplatesEntities = createSelector(
  getMasterTemplatesState,
  fromMasterTemplates.selectMasterTemplatesEntities
);

export const getMasterTemplatesUuids = createSelector(
  getMasterTemplatesState,
  fromMasterTemplates.selectMasterTemplatesUuids
);

export const getAllMasterTemplates = createSelector(
  getMasterTemplatesState,
  fromMasterTemplates.selectAllMasterTemplates
);

export const getMasterSelectedTemplate = createSelector(
  getMasterTemplatesState,
  (state: fromMasterTemplates.MasterTemplatesState) => state.selectedMasterTemplate
);

export const getMasterTemplatesTotals = createSelector(
  getMasterTemplatesState,
  fromMasterTemplates.selectMasterTemplatesTotal
);

export const getMasterTemplatesTotal = createSelector(
  getMasterTemplatesState,
  (state: fromMasterTemplates.MasterTemplatesState) => state.total
);

export const getMasterTemplateConfig = createSelector(
  getMasterTemplatesState,
  (state: fromMasterTemplates.MasterTemplatesState) => state.pagination
);

export const getMasterTemplateFilter = createSelector(
  getMasterTemplatesState,
  (state: fromMasterTemplates.MasterTemplatesState) => state.filters
);

export const getMasterTemplatesLoaded = createSelector(
  getMasterTemplatesState,
  (state: fromMasterTemplates.MasterTemplatesState) => state.loaded
);

export const getMasterTemplatesLoading = createSelector(
  getMasterTemplatesState,
  (state: fromMasterTemplates.MasterTemplatesState) => state.loading
);

export const getMasterTemplatesError = createSelector(
  getMasterTemplatesState,
  (state: fromMasterTemplates.MasterTemplatesState) => state.error
);

export const masterTemplatesQuery = {
  getMasterTemplatesState,
  getMasterTemplatesEntities,
  getMasterTemplatesUuids,
  getAllMasterTemplates,
  getMasterSelectedTemplate,
  getMasterTemplatesTotals,
  getMasterTemplatesTotal,
  getMasterTemplateConfig,
  getMasterTemplateFilter,
  getMasterTemplatesLoaded,
  getMasterTemplatesLoading,
  getMasterTemplatesError
};
