import { IEmailModuleBranch } from './email-module.interface';
import { ISmsModuleBranch } from './sms-module.interface';

export interface IEmailBranch {
  active: boolean;
  modules: IEmailModuleBranch[];
}

export interface ISmsBranch{
  active: boolean;
  modules: ISmsModuleBranch[];
}
