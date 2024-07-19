import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromInboxMessages from '../reducers/inbox-messages.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IInboxMessages } from '../../models';

export const getInboxMessagesState = createSelector(
  fromFeature.getMarketingState,
  (state: fromFeature.ICampaignsState) => state.inboxMessages
);

export const getInboxMessagesEntities = createSelector(
  getInboxMessagesState,
  fromInboxMessages.selectInboxMessagesEntities
);

export const getInboxMessagesUuids = createSelector(
  getInboxMessagesState,
  fromInboxMessages.selectInboxMessagesUuids
);

export const getAllInboxMessages = createSelector(
  getInboxMessagesState,
  fromInboxMessages.selectAllInboxMessages
);

export const getInboxMessagesFilters = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.filters
);

export const getSelectedInbox = createSelector(
  getInboxMessagesEntities,
  fromRoot.getRouterState,
  (entities, router): IInboxMessages.IDocument =>
    entities ? router.state && entities[router.state.params.uuid] : null
);

export const getInboxMessagesTotals = createSelector(
  getInboxMessagesState,
  fromInboxMessages.selectInboxMessagesTotal
);

export const getInboxMessagesTotal = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.total
);

export const getInboxMessagesConfig = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.pagination
);

export const getInboxMessagesPage = createSelector(
  getInboxMessagesConfig,
  (pagination): IInboxMessages.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getInboxMessagesLoaded = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.loaded
);

export const getInboxMessagesLoading = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.loading
);

export const getInboxMessagesError = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.error
);

export const getSearchedAccountEntities = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.accounts
);

export const getSearchedAccount = createSelector(
  getSearchedAccountEntities,
  (entities) =>
    entities ? Object.keys(entities).map((uuid) => entities[uuid]) : []
);



export const getVehicles = createSelector(
  getInboxMessagesState,
  (state: fromInboxMessages.InboxMessagesState) => state.vehicles
);

export const getSearchedVehicle = createSelector(
  getVehicles,
  (entities) =>
    entities ? Object.keys(entities).map((uuid) => entities[uuid]) : []
);

export const inboxMessagesQuery = {
  getInboxMessagesUuids,
  getInboxMessagesEntities,
  getSelectedInbox,
  getAllInboxMessages,
  getInboxMessagesTotal,
  getInboxMessagesTotals,
  getInboxMessagesConfig,
  getInboxMessagesPage,
  getInboxMessagesLoaded,
  getInboxMessagesLoading,
  getInboxMessagesError,
  getInboxMessagesFilters,
  getVehicles,
  getSearchedAccount,
  getSearchedVehicle
};
