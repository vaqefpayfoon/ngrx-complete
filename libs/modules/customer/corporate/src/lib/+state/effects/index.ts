import { CorporatesEffects } from './corporates.effects';
import { BranchEffects } from './branch.effects';
import { AppsEffects } from './apps.effects';
import { AgreementsEffects } from './agreements.effects';
import { BrandsEffects } from './brands.effects';
import { OperationAccountsEffects } from './operation-accounts.effects';
import { OffDaysEffects } from './off-days.effect';

export const EFFECTS: any[] = [
  CorporatesEffects,
  BranchEffects,
  AppsEffects,
  AgreementsEffects,
  BrandsEffects,
  OperationAccountsEffects,
  OffDaysEffects
];

export * from './corporates.effects';
export * from './branch.effects';
export * from './apps.effects';
export * from './agreements.effects';
export * from './brands.effects';
export * from './operation-accounts.effects';
export * from './off-days.effect';