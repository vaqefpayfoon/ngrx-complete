import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromEmailTemplates from './email-templates.reducer';
import * as fromInboxTemplates from './inbox-templates.reducer';
import * as fromCampaignTemplates from './campaign-templates.reducer';
import * as fromMasterTemplates from './master-templates.reducer';

export interface ITemplatesState {
  readonly emailTemplates: fromEmailTemplates.EmailTemplatesState;
  readonly inboxTemplates: fromInboxTemplates.InboxTemplatesState;
  readonly campaignTemplates: fromCampaignTemplates.CampaignTemplatesState;
  readonly masterHtmlTemplates: fromMasterTemplates.MasterTemplatesState;
}

export const REDUCERS: ActionReducerMap<ITemplatesState> = {
  emailTemplates: fromEmailTemplates.reducer,
  inboxTemplates: fromInboxTemplates.reducer,
  campaignTemplates: fromCampaignTemplates.reducer,
  masterHtmlTemplates: fromMasterTemplates.reducer
};

export const getTemplateState = createFeatureSelector<ITemplatesState>(
  'templates'
);
