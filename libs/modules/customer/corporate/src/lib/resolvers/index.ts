
import { BranchesResolver } from './branches/branches.resolver';
import { GlobalBrandsResolver } from './brands/global-brands.resolver';
import { OperationsResolver } from './operation-accounts/operations.resolver';
import { SchedulesOffDaysResolver } from './schedulesOffDays/schedules-offDays.resolver';

export const resolvers: any[] = [
  GlobalBrandsResolver,
  OperationsResolver,
  BranchesResolver,
  SchedulesOffDaysResolver
];

export * from './brands/global-brands.resolver';
export * from './operation-accounts/operations.resolver';
export * from './branches/branches.resolver';
export * from './schedulesOffDays/schedules-offDays.resolver';
