import { AccountsService } from './accounts.service';
import { RolesService } from './roles.service';
import { PermissionsService } from './permissions.service';
import { GroupsService } from './groups.service';
import { CountryService } from './country.service';
import { CurrenciesService } from './currencies.service';

export const services: any[] = [
  AccountsService,
  RolesService,
  PermissionsService,
  GroupsService,
  CountryService,
  CurrenciesService
];

export * from './accounts.service';
export * from './roles.service';
export * from './permissions.service';
export * from './groups.service';
export * from './country.service';
export * from './currencies.service';
