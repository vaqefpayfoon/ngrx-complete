import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCampaigns from './campaigns.reducer';
import * as fromCampaignTargets from './campaign-targets.reducer';
import * as fromInboxMessages from './inbox-messages.reducer';

export interface ICampaignsState {
  readonly campaigns: fromCampaigns.CampaignsState;
  readonly campaignTargets: fromCampaignTargets.CampaignTargetsState;
  readonly inboxMessages: fromInboxMessages.InboxMessagesState;
}

export const REDUCERS: ActionReducerMap<ICampaignsState> = {
  campaigns: fromCampaigns.reducer,
  campaignTargets: fromCampaignTargets.reducer,
  inboxMessages: fromInboxMessages.reducer
};

export const getMarketingState = createFeatureSelector<ICampaignsState>(
  'marketing'
);
