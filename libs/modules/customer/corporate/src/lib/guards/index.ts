import { CorporatesGuard } from './corporates.guard';
import { CorporateExistsGuard } from './corporate-exists.guard';
import { BranchesGuard } from './branches.guard';
import { BranchExistsGuard } from './branch-exists.guard';
import { AppsGuard } from './apps.guard';
import { AppExistsGuard } from './app-exists.guard';
import { AgreementsGuard } from './agreements.guard';
import { AgreementExistsGuard } from './agreement-exists.guard';

export const guards: any[] = [
  CorporatesGuard,
  CorporateExistsGuard,
  BranchesGuard,
  BranchExistsGuard,
  AppsGuard,
  AppExistsGuard,
  AgreementsGuard,
  AgreementExistsGuard,
];

export * from './corporates.guard';
export * from './branches.guard';
export * from './corporate-exists.guard';
export * from './branch-exists.guard';
export * from './apps.guard';
export * from './app-exists.guard';
export * from './agreements.guard';
export * from './agreement-exists.guard';