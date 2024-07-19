import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromInboxTemplates from '../reducers/inbox-templates.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ITemplates } from '../../models';

export const getInboxTemplatesState = createSelector(
  fromFeature.getTemplateState,
  (state: fromFeature.ITemplatesState) => state.inboxTemplates
);

export const getInboxTemplatesEntities = createSelector(
  getInboxTemplatesState,
  fromInboxTemplates.selectInboxTemplatesEntities
);

export const getInboxTemplatesUuids = createSelector(
  getInboxTemplatesState,
  fromInboxTemplates.selectInboxTemplatesUuids
);

export const getInboxAllTemplates = createSelector(
  getInboxTemplatesState,
  fromInboxTemplates.selectAllInboxTemplates
);

export const getInboxTemplatesTotals = createSelector(
  getInboxTemplatesState,
  fromInboxTemplates.selectInboxTemplatesTotal
);

export const getInboxTemplatesTotal = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.total
);

export const getInboxTemplatesConfig = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.pagination
);

export const getInboxTemplateTargetInboxsFilter = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.filters
);

export const getInboxTemplatesPage = createSelector(
  getInboxTemplatesConfig,
  (pagination): ITemplates.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getInboxSelectedTemplate = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.selectedInboxTemplate
);

export const getInboxTemplatesLoaded = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.loaded
);

export const getInboxTemplatesLoading = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.loading
);

export const getInboxTemplatesError = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.error
);

export const getInboxTemplateImages = createSelector(
  getInboxTemplatesState,
  (state: fromInboxTemplates.InboxTemplatesState) => state.images
);

export const inboxTemplatesQuery = {
  getInboxTemplatesUuids,
  getInboxTemplatesEntities,
  getInboxAllTemplates,
  getInboxTemplatesTotal,
  getInboxTemplatesTotals,
  getInboxTemplatesConfig,
  getInboxTemplateTargetInboxsFilter,
  getInboxTemplatesPage,
  getInboxSelectedTemplate,
  getInboxTemplatesLoaded,
  getInboxTemplatesLoading,
  getInboxTemplatesError,
  getInboxTemplateImages
};
