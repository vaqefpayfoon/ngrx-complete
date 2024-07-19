import { CampaignsFacade } from './campaigns.facade';
import { CampaignTargetsFacade } from './campaign-targets.facade';
import { InboxMessagesFacade } from './inbox-messages.facade';

export const facades: any[] = [
  CampaignsFacade,
  CampaignTargetsFacade,
  InboxMessagesFacade
];

export * from './campaigns.facade';
export * from './campaign-targets.facade';
export * from './inbox-messages.facade';
