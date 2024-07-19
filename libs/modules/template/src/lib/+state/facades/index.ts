import { EmailTemplatesFacade } from './email-templates.facade';
import { InboxTemplatesFacade } from './inbox-templates.facade';
import { CampaignTemplatesFacade } from './campaign-templates.facade';
import { MasterTemplatesFacade } from './master-templates.facade';

export const facades: any[] = [
  MasterTemplatesFacade,
  InboxTemplatesFacade,
  EmailTemplatesFacade,
  CampaignTemplatesFacade
];

export * from './email-templates.facade';
export * from './inbox-templates.facade';
export * from './campaign-templates.facade';
export * from './master-templates.facade';
