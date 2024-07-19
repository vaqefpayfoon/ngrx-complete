import { IEmailBranch, ISmsBranch } from './email-branches.interface';

export interface INotificationBranch {
  email: IEmailBranch;
  sms: ISmsBranch;
}
