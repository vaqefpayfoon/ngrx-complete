import { BranchNotification } from './email-branches.enum';

export interface ISmsModuleBranch {
  title: string;
  key: string;
  active: boolean;
  events:IModuleEventBranch[]
}

export interface IModuleEventBranch {
  title: string;
  active: boolean;
  key: string;
  body: string;
  sendSmsDaysBefore?: number;

}
