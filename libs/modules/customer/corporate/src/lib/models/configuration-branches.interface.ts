import { INotificationBranch } from './notification-branches.interface';

export interface IBranchCdkSubscriptionsDto {
  dealerId?: string;
}
export class IBranchFortellisSubscriptionsDto {
  subscriptionId?: string;
}
export class IBranchSubscriptionsDto {
  cdk?: IBranchCdkSubscriptionsDto;
  fortellis?: IBranchFortellisSubscriptionsDto;
  adtorque: IBranchAdtorqueSubscriptionsDto;
  leaseGenius?: IBranchLeaseGeniusSubscriptions;
}

export interface IBranchLeaseGeniusSubscriptions {
  dealerId: string;
}

export interface IConfiguration {
  notification: INotificationBranch;
  subscriptions?: IBranchSubscriptionsDto;
}

export interface IBranchAdtorqueSubscriptionsDto {
  workshopId?: string;
}
