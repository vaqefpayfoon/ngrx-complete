import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAccounts from './accounts.reducer';
import * as fromCustomerAccounts from './customer-accounts.reducer';
import * as fromOperationAccounts from './operation-accounts.reducer';
import * as fromRoles from './roles.reducer';
import * as fromRoleTags from './role-tags.reducer';
import * as fromGroups from './groups.reducer';
import * as fromCountries from './countries.reducer';
import * as fromCurrencies from './currencies.reducer';
import * as fromBrands from './brands.reducers';
import * as fromCorporates from './corporates.reducer';

export interface IAdminState {
  readonly accounts: fromAccounts.AccountState;
  readonly customerAccounts: fromCustomerAccounts.CustomerAccountState;
  readonly operationAccounts: fromOperationAccounts.OperationAccountState;
  readonly roles: fromRoles.RoleState;
  readonly roleTags: fromRoleTags.RoleTagsState;
  readonly groups: fromGroups.GroupState;
  readonly countries: fromCountries.CountryState;
  readonly currencies: fromCurrencies.CurrenciesState;
  readonly brands: fromBrands.BrandsState;
  readonly corporates: fromCorporates.CorporateState;
}

export const REDUCERS: ActionReducerMap<IAdminState> = {
  accounts: fromAccounts.reducer,
  customerAccounts: fromCustomerAccounts.reducer,
  operationAccounts: fromOperationAccounts.reducer,
  roles: fromRoles.reducer,
  roleTags: fromRoleTags.reducer,
  groups: fromGroups.reducer,
  countries: fromCountries.reducer,
  currencies: fromCurrencies.reducer,
  brands: fromBrands.reducer,
  corporates: fromCorporates.reducer
};

export const getAdminState = createFeatureSelector<IAdminState>('admin');
