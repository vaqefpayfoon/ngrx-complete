import { AccountsEffects } from './accounts.effects';
import { CustomerAccountsEffects } from './customer-accounts.effects';
import { OperationAccountsEffects } from './operation-accounts.effects';
import { RolesEffects } from './roles.effects';
import { RoleTagsEffects } from './role-tags.effects';
import { GroupsEffects } from './groups.effects';
import { CountriesEffects } from './countries.effects';
import { CurrenciesEffects } from './currencies.effects';
import { BrandsEffects } from './brands.effects';
import {CorporatesEffects} from './corporates.effects';

export const EFFECTS: any[] = [
  AccountsEffects,
  CustomerAccountsEffects,
  OperationAccountsEffects,
  RolesEffects,
  RoleTagsEffects,
  GroupsEffects,
  CountriesEffects,
  CurrenciesEffects,
  BrandsEffects,
  CorporatesEffects
];

export * from './accounts.effects';
export * from './customer-accounts.effects';
export * from './operation-accounts.effects';
export * from './roles.effects';
export * from './roles.effects';
export * from './groups.effects';
export * from './countries.effects';
export * from './currencies.effects';
export * from './brands.effects';
export * from './corporates.effects';
