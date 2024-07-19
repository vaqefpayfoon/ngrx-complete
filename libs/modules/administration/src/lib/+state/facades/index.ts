import { AccountsFacade } from './accounts.facade';
import { CustomerAccountsFacade } from './customer-accounts.facade';
import { OperationAccountsFacade } from './operation-accounts.facade';
import { RolesFacade } from './roles.facade';
import { RoleTagsFacade } from './role-tags.facade';
import { GroupsFacade } from './groups.facade';
import { CountriesFacade } from './countries.facade';
import { CurrenciesFacade } from './currencies.facade';
import { BrandsFacade } from './brands.facade';

export const facades: any[] = [
  AccountsFacade,
  CustomerAccountsFacade,
  OperationAccountsFacade,
  RolesFacade,
  RoleTagsFacade,
  GroupsFacade,
  CountriesFacade,
  CurrenciesFacade,
  BrandsFacade,
];

export * from './accounts.facade';
export * from './customer-accounts.facade';
export * from './operation-accounts.facade';
export * from './roles.facade';
export * from './role-tags.facade';
export * from './groups.facade';
export * from './countries.facade';
export * from './currencies.facade';
export * from './brands.facade';
