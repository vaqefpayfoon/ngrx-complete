import { CampaignsService } from './campaigns/campaigns.service';
import { CampaignTargetsService } from './campaign-targets/campaign-targets.service';
import { InboxMessageService } from './inbox-message/inbox-message.service';

export const services: any[] = [
  CampaignsService,
  CampaignTargetsService,
  InboxMessageService
];

export * from './campaigns/campaigns.service';
export * from './campaign-targets/campaign-targets.service';
export * from './inbox-message/inbox-message.service';
