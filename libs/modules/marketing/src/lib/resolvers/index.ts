//campaigns
import { CampaignsResolver } from './campaigns/campaigns.resolver';
import { CampaignExistsResolver } from './campaigns/campaign-exists.resolver';

//Inbox messages
import { InboxMessagesResolver } from './inbox-messages/inbox-messages.resolver';
import { InboxMessageExistsResolver } from './inbox-messages/inbox-message-exists.resolver';

export const resolvers: any[] = [
  CampaignsResolver,
  CampaignExistsResolver,
  InboxMessagesResolver,
  InboxMessageExistsResolver,
];

export * from './campaigns/campaigns.resolver';
export * from './campaigns/campaign-exists.resolver';
export * from './inbox-messages/inbox-messages.resolver';
export * from './inbox-messages/inbox-message-exists.resolver';
