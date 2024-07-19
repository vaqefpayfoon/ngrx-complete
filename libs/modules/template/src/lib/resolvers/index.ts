//Master
import { MasterTemplatesResolver } from './master-templates/master-templates.resolver';
import { MasterTemplateExistsResolver } from './master-templates/master-template-exists.resolver';

//Inbox
import { InboxTemplatesResolver } from './inbox-templates/inbox-templates.resolver';
import { InboxTemplateExistsResolver } from './inbox-templates/inbox-template-exists.resolver';

//Email
import { EmailTemplatesResolver } from './email-templates/email-templates.resolver';
import { EmailTemplateExistsResolver } from './email-templates/email-template-exists.resolver';

//Campaign
import { CampaignTemplatesResolver } from './campaign-templates/campaign-templates.resolver';
import { CampaignTemplateExistsResolver } from './campaign-templates/campaign-template-exists.resolver';

export const resolvers: any[] = [
  MasterTemplatesResolver,
  MasterTemplateExistsResolver,
  InboxTemplatesResolver,
  InboxTemplateExistsResolver,
  EmailTemplatesResolver,
  EmailTemplateExistsResolver,
  CampaignTemplatesResolver,
  CampaignTemplateExistsResolver,
];

export * from './master-templates/master-templates.resolver';
export * from './master-templates/master-template-exists.resolver';
export * from './inbox-templates/inbox-templates.resolver';
export * from './inbox-templates/inbox-template-exists.resolver';
export * from './email-templates/email-templates.resolver';
export * from './email-templates/email-template-exists.resolver';
export * from './campaign-templates/campaign-templates.resolver';
export * from './campaign-templates/campaign-template-exists.resolver';
