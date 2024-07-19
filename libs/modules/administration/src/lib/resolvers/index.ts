//Account
import { OperationsResolver } from './accounts/operations.resolver';
import { AccountsResolver } from './accounts/accounts.resolver';
import { AccountCustomerResolver } from './accounts/account-customer.resolver';
import { AccountExistsResolver } from './accounts/account-exists.resolver';
import { OperationsExistsResolver } from './accounts/operations-exists.resolver';
import { AccountCustomerExistsResolver } from './accounts/account-customer-exists.resolver';
import { GlobalBrandsResolver } from './brands/global-brands.resolver';

//Groups
import { GroupsResolver } from './groups/groups.resolver';
import { GroupExistsResolver } from './groups/group-exists.resolver';

//Roles
import { RolesResolver } from './roles/roles.resolver';
import { RoleTagsResolver } from './roles/role-tags.resolver';
import { RoleExistsResolver } from './roles/role-exists.resolver';

//Countries
import { CountriesResolver } from './countries/countries.resolver';
import { CountryExistsResolver } from './countries/country-exists.resolver';
import { CurrenciesResolver } from './countries/currencies.resolver';

export const resolvers: any[] = [
  OperationsResolver,
  AccountsResolver,
  AccountCustomerResolver,
  GroupsResolver,
  GroupExistsResolver,
  OperationsExistsResolver,
  AccountCustomerExistsResolver,
  RolesResolver,
  RoleTagsResolver,
  RoleExistsResolver,
  AccountExistsResolver,
  CountriesResolver,
  CountryExistsResolver,
  CurrenciesResolver,
  GlobalBrandsResolver,
];

export * from './accounts/operations.resolver';
export * from './accounts/accounts.resolver';
export * from './accounts/account-customer.resolver';
export * from './groups/groups.resolver';
export * from './groups/group-exists.resolver';
export * from './accounts/operations-exists.resolver';
export * from './accounts/account-customer-exists.resolver';
export * from './roles/roles.resolver';
export * from './roles/role-tags.resolver';
export * from './roles/role-exists.resolver';
export * from './accounts/account-exists.resolver';
export * from './countries/countries.resolver';
export * from './countries/country-exists.resolver';
export * from './countries/currencies.resolver';
export * from './brands/global-brands.resolver';
