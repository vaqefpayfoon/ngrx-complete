import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromEmailTemplates from '../reducers/email-templates.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ITemplates } from '../../models';

export const getEmailTemplatesState = createSelector(
  fromFeature.getTemplateState,
  (state: fromFeature.ITemplatesState) => state.emailTemplates
);

export const getEmailTemplatesEntities = createSelector(
  getEmailTemplatesState,
  fromEmailTemplates.selectEmailTemplatesEntities
);

export const getEmailTemplatesUuids = createSelector(
  getEmailTemplatesState,
  fromEmailTemplates.selectEmailTemplatesUuids
);

export const getEmailAllTemplates = createSelector(
  getEmailTemplatesState,
  fromEmailTemplates.selectAllEmailTemplates
);

export const getEmailTemplatesTotals = createSelector(
  getEmailTemplatesState,
  fromEmailTemplates.selectEmailTemplatesTotal
);

export const getEmailTemplatesTotal = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.total
);

export const getEmailTemplatesConfig = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.pagination
);

export const getEmailTemplateTargetEmailsFilter = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.filters
);

export const getEmailTemplatesPage = createSelector(
  getEmailTemplatesConfig,
  (pagination): ITemplates.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getEmailSelectedTemplate = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.selectedEmailTemplate
);

export const getEmailTemplatesLoaded = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.loaded
);

export const getEmailTemplatesLoading = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.loading
);

export const getEmailTemplatesError = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.error
);

export const getEmailTemplateImages = createSelector(
  getEmailTemplatesState,
  (state: fromEmailTemplates.EmailTemplatesState) => state.images
);

export const emailTemplatesQuery = {
  getEmailTemplatesUuids,
  getEmailTemplatesEntities,
  getEmailAllTemplates,
  getEmailTemplatesTotal,
  getEmailTemplatesTotals,
  getEmailTemplatesConfig,
  getEmailTemplateTargetEmailsFilter,
  getEmailTemplatesPage,
  getEmailSelectedTemplate,
  getEmailTemplatesLoaded,
  getEmailTemplatesLoading,
  getEmailTemplatesError,
  getEmailTemplateImages
};
