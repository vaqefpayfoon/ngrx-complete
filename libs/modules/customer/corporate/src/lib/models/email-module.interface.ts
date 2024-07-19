import { BranchNotification } from './email-branches.enum';

export interface IEmailModuleBranch {
  title: string;
  key: string;
  active: boolean;
  events: IModuleEventBranch[];
}

export interface IModuleEventBranch {
  title: string;
  active: boolean;
  key: string;
  to: BranchNotification | string;
  cc?: BranchNotification[] | string[];
}
