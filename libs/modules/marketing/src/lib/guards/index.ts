import { CampaignsGuard } from './campaigns/campaigns.guard';
import { CampaignExistsGuard } from './campaigns/campaign-exists.guard';
import { InboxMessagesGuard } from './inbox-messages/inbox-messages.guard';
import { InboxMessageExistsGuard } from './inbox-messages/inbox-message-exists.guard';

export const guards: any[] = [
  CampaignsGuard,
  CampaignExistsGuard,
  InboxMessagesGuard,
  InboxMessageExistsGuard
];

export * from './campaigns/campaigns.guard';
export * from './campaigns/campaign-exists.guard';
export * from './inbox-messages/inbox-messages.guard';
export * from './inbox-messages/inbox-message-exists.guard';
