import { AccountsGuard } from './accounts/accounts.guard';
import { AccountCustomerGuard } from './accounts/account-customer.guard';
import { AccountExistsGuard } from './accounts/account-exists.guard';
import { AccountCustomerExistsGuard } from './accounts/account-customer-exists.guard';
import { AccountOperationGuard } from './accounts/account-operation.guard';
import { AccountOperationExistsGuard } from './accounts/account-operation-exists.guard';
import { RolesGuard } from './roles/roles.guard';
import { RoleExistsGuard } from './roles/role-exists.guard';
import { RoleTagsGuard } from './roles/role-tags.guard';
import { GroupsGuard } from './groups/groups.guard';
import { GroupExistsGuard } from './groups/group-exists.guard';
import { CountriesGuard } from './countries/countries.guard';
import { CountryExistsGuard } from './countries/country-exists.guard';
import { CurrenciesGuard } from './countries/currencies.guard';

export const guards: any[] = [
  AccountsGuard,
  AccountCustomerGuard,
  RolesGuard,
  RoleExistsGuard,
  RoleTagsGuard,
  GroupsGuard,
  GroupExistsGuard,
  CountriesGuard,
  CountryExistsGuard,
  CurrenciesGuard,
  AccountExistsGuard,
  AccountCustomerExistsGuard,
  AccountOperationGuard,
  AccountOperationExistsGuard
];

export * from './accounts/accounts.guard';
export * from './accounts/account-customer.guard';
export * from './accounts/account-exists.guard';
export * from './roles/roles.guard';
export * from './roles/role-tags.guard';
export * from './roles/role-exists.guard';
export * from './groups/groups.guard';
export * from './groups/group-exists.guard';
export * from './countries/countries.guard';
export * from './countries/country-exists.guard';
export * from './countries/currencies.guard';
export * from './accounts/account-customer-exists.guard';
export * from './accounts/account-operation.guard';
export * from './accounts/account-operation-exists.guard';
