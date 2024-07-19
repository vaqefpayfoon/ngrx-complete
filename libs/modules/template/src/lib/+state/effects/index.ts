import { MasterTemplatesEffects } from './master-templates.effects';
import { EmailTemplatesEffects } from './email-templates.effects';
import { InboxTemplatesEffects } from './inbox-templates.effects';
import { CampaignTemplatesEffects } from './campaign-templates.effects';

export const EFFECTS: any[] = [
  EmailTemplatesEffects,
  MasterTemplatesEffects,
  InboxTemplatesEffects,
  CampaignTemplatesEffects
];

export * from './master-templates.effects';
export * from './email-templates.effects';
export * from './inbox-templates.effects';
export * from './campaign-templates.effects';
