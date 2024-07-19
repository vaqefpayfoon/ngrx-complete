import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { EmailTemplateItemComponent } from './email-template-item/email-template-item.component';

import { InboxTemplatesComponent } from './inbox-templates/inbox-templates.component';
import { InboxTemplateItemComponent } from './inbox-template-item/inbox-template-item.component';

import { CampaignTemplatesComponent } from './campaign-templates/campaign-templates.component';
import { CampaignTemplateItemComponent } from './campaign-template-item/campaign-template-item.component';

import { MasterTemplatesComponent } from './master-templates/master-templates.component';
import { MasterTemplateItemComponent } from './master-template-item/master-template-item.component';

export const COMPONENTS: any[] = [
  MasterTemplatesComponent,
  MasterTemplateItemComponent,
  EmailTemplatesComponent,
  EmailTemplateItemComponent,
  InboxTemplatesComponent,
  InboxTemplateItemComponent,
  CampaignTemplatesComponent,
  CampaignTemplateItemComponent
];

export * from './master-templates/master-templates.component';
export * from './master-template-item/master-template-item.component';
export * from './email-templates/email-templates.component';
export * from './email-template-item/email-template-item.component';
export * from './inbox-templates/inbox-templates.component';
export * from './inbox-template-item/inbox-template-item.component';
export * from './campaign-templates/campaign-templates.component';
export * from './campaign-template-item/campaign-template-item.component';
