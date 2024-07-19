import { CorporatesFacade } from './corporates.facade';
import { BranchFacade } from './branch.facade';
import { AppsFacade } from './apps.facade';
import { AgreementsFacade } from './agreements.facade';
import { BrandsFacade } from './brands.facade';
import { OperationAccountsFacade } from './operation-accounts.facade'

export const facades: any[] = [
  CorporatesFacade,
  BranchFacade,
  AppsFacade,
  AgreementsFacade,
  BrandsFacade,
  OperationAccountsFacade
];

export * from './corporates.facade';
export * from './branch.facade';
export * from './apps.facade';
export * from './agreements.facade';
export * from './brands.facade';
export * from './operation-accounts.facade';
