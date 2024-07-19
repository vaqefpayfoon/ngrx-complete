import { CampaignsEffects } from './campaigns.effects';
import { CampaignTargetsEffects } from './campaign-targets.effects';
import { InboxMessagesEffects } from './inbox-messages.effects';

export const EFFECTS: any[] = [
  CampaignsEffects,
  CampaignTargetsEffects,
  InboxMessagesEffects
];

export * from './campaigns.effects';
export * from './campaign-targets.effects';
export * from './inbox-messages.effects';
