import { MasterTemplatesGuard } from './master-templates.guard';
import { EmailTemplatesGuard } from './email-templates.guard';
import { InboxTemplatesGuard } from './inbox-templates.guard';
import { CampaignTemplatesGuard } from './campaign-templates.guard';

import { InboxTemplateExistsGuard } from './inbox-template-exists.guard';
import { EmailTemplateExistsGuard } from './email-template-exists.guard';
import { CampaignTemplateExistsGuard } from './campaign-template-exists.guard';
import { MasterTemplateExistsGuard } from './master-template-exists.guard';

export const guards: any[] = [
  MasterTemplatesGuard,
  EmailTemplatesGuard,
  InboxTemplatesGuard,
  CampaignTemplatesGuard,
  InboxTemplateExistsGuard,
  EmailTemplateExistsGuard,
  CampaignTemplateExistsGuard,
  MasterTemplateExistsGuard
];

export * from './master-templates.guard';
export * from './email-templates.guard';
export * from './inbox-templates.guard';
export * from './campaign-templates.guard';

export * from './inbox-template-exists.guard';
export * from './email-template-exists.guard';
export * from './campaign-template-exists.guard';
export * from './master-template-exists.guard';
