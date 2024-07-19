import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Admin Components
import * as adminComponents from './components';

// Admin Containers
import * as adminContainers from './containers';

// resolvers
import * as fromResolvers from './resolvers';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';
import * as fromAuth from '@neural/auth';

// Ui
import { UiModule } from '@neural/ui';

// Pipe
import { PipesModule } from '@neural/shared/util/pipes';

// Models
import { IAccount } from './models';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'account',
    pathMatch: 'full',
  },
  {
    path: 'account',
    component: adminContainers.AccountsComponent,
    canActivate: [fromGuards.AccountsGuard, fromGuards.GroupsGuard],
    resolve: [fromResolvers.AccountsResolver, fromResolvers.GroupsResolver],
    data: { corporate: false, branch: true, type: IAccount.AccountType.ADMIN },
  },
  {
    path: 'account/new',
    component: adminContainers.AccountItemComponent,
    canActivate: [
      fromGuards.AccountsGuard,
      fromGuards.GroupsGuard,
      fromAuth.CallingCodesExistsGuard,
    ],
    resolve: [
      fromResolvers.AccountsResolver,
      fromResolvers.GroupsResolver,
      fromResolvers.GlobalBrandsResolver,
      fromResolvers.AccountCustomerResolver,
    ],
    data: { corporate: false, branch: true, type: IAccount.AccountType.ADMIN },
  },
  {
    path: 'account/search',
    component: adminContainers.AccountItemComponent,
    canActivate: [
      fromGuards.AccountsGuard,
      fromGuards.GroupsGuard,
      fromAuth.CallingCodesExistsGuard,
    ],
    resolve: [fromResolvers.AccountsResolver, fromResolvers.GroupsResolver],
    data: { corporate: false, branch: true, type: IAccount.AccountType.ALL },
  },
  {
    path: 'account/:uuid',
    component: adminContainers.AccountItemComponent,
    canActivate: [
      fromGuards.AccountsGuard,
      fromGuards.AccountExistsGuard,
      fromGuards.GroupsGuard,
      fromAuth.CallingCodesExistsGuard,
    ],
    resolve: [
      fromResolvers.AccountsResolver,
      fromResolvers.GroupsResolver,
      fromResolvers.AccountExistsResolver,
      fromResolvers.GlobalBrandsResolver,
      fromResolvers.AccountCustomerResolver
    ],
    data: { corporate: false, branch: true, type: IAccount.AccountType.ADMIN },
  },
  {
    path: 'customer',
    component: adminContainers.CustomerAccountsComponent,
    canActivate: [fromGuards.AccountCustomerGuard, fromGuards.GroupsGuard],
    resolve: [
      fromResolvers.AccountCustomerResolver,
      fromResolvers.GroupsResolver,
    ],
    data: {
      corporate: false,
      branch: true,
      type: IAccount.AccountType.CUSTOMER,
    },
  },
  {
    path: 'customer/new',
    component: adminContainers.CustomerAccountItemComponent,
    canActivate: [
      fromGuards.AccountCustomerGuard,
      fromGuards.GroupsGuard,
      fromAuth.CallingCodesExistsGuard,
    ],
    resolve: [
      fromResolvers.AccountCustomerResolver,
      fromResolvers.GroupsResolver,
    ],
    data: {
      corporate: false,
      branch: true,
      type: IAccount.AccountType.CUSTOMER,
    },
  },
  {
    path: 'customer/:uuid',
    component: adminContainers.CustomerAccountItemComponent,
    canActivate: [
      fromGuards.AccountCustomerGuard,
      fromGuards.AccountCustomerExistsGuard,
      fromGuards.GroupsGuard,
      fromAuth.CallingCodesExistsGuard,
    ],
    resolve: [
      fromResolvers.AccountCustomerResolver,
      fromResolvers.AccountCustomerExistsResolver,
      fromResolvers.GroupsResolver,
    ],
    data: {
      corporate: false,
      branch: true,
      type: IAccount.AccountType.CUSTOMER,
    },
  },
  {
    path: 'operation',
    component: adminContainers.OperationAccountsComponent,
    canActivate: [fromGuards.AccountOperationGuard],
    data: {
      corporate: false,
      branch: true,
      type: IAccount.AccountType.OPERATION,
    },
    resolve: { operations: fromResolvers.OperationsResolver },
  },
  {
    path: 'operation/new',
    component: adminContainers.OperationAccountItemComponent,
    canActivate: [
      fromGuards.AccountOperationGuard,
      fromAuth.CallingCodesExistsGuard,
      fromGuards.GroupsGuard,
    ],
    resolve: [
      fromResolvers.OperationsResolver,
      fromResolvers.GroupsResolver,
      fromResolvers.GlobalBrandsResolver,
    ],
    data: {
      corporate: false,
      branch: true,
      type: IAccount.AccountType.OPERATION,
    },
  },
  {
    path: 'operation/:uuid',
    component: adminContainers.OperationAccountItemComponent,
    canActivate: [
      fromGuards.AccountOperationGuard,
      fromGuards.AccountOperationExistsGuard,
      fromAuth.CallingCodesExistsGuard,
      fromGuards.GroupsGuard,
    ],
    resolve: [
      fromResolvers.OperationsResolver,
      fromResolvers.OperationsExistsResolver,
      fromResolvers.GroupsResolver,
      fromResolvers.GlobalBrandsResolver,
    ],
    data: {
      corporate: false,
      branch: true,
      type: IAccount.AccountType.OPERATION,
    },
  },
  {
    path: 'roles',
    component: adminContainers.RolesComponent,
    canActivate: [fromGuards.RolesGuard, fromGuards.RoleTagsGuard],
    resolve: [fromResolvers.RolesResolver, fromResolvers.RoleTagsResolver],
    data: { corporate: true, branch: true },
  },
  {
    path: 'role/new',
    component: adminContainers.RoleItemComponent,
    canActivate: [fromGuards.RolesGuard, fromGuards.RoleTagsGuard],
    resolve: [fromResolvers.RolesResolver, fromResolvers.RoleTagsResolver],
    data: { corporate: true, branch: true },
  },
  {
    path: 'role/:uuid',
    component: adminContainers.RoleItemComponent,
    canActivate: [
      fromGuards.RoleTagsGuard,
      fromGuards.RolesGuard,
      fromGuards.RoleExistsGuard,
    ],
    resolve: [
      fromResolvers.RolesResolver,
      fromResolvers.RoleTagsResolver,
      fromResolvers.RoleExistsResolver,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: 'groups',
    component: adminContainers.GroupsComponent,
    canActivate: [fromGuards.GroupsGuard, fromGuards.RolesGuard],
    resolve: [fromResolvers.GroupsResolver, fromResolvers.RolesResolver],
    data: { corporate: false, branch: true },
  },
  {
    path: 'group/new',
    component: adminContainers.GroupItemComponent,
    canActivate: [fromGuards.GroupsGuard, fromGuards.RolesGuard],
    resolve: [fromResolvers.GroupsResolver, fromResolvers.RolesResolver],
    data: { corporate: false, branch: true },
  },
  {
    path: 'group/:uuid',
    component: adminContainers.GroupItemComponent,
    canActivate: [
      fromGuards.GroupsGuard,
      fromGuards.GroupExistsGuard,
      fromGuards.RolesGuard,
    ],
    resolve: [
      fromResolvers.GroupsResolver,
      fromResolvers.RolesResolver,
      fromResolvers.GroupExistsResolver,
    ],
    data: { corporate: false, branch: true },
  },
  {
    path: 'countries',
    component: adminContainers.CountriesComponent,
    canActivate: [fromGuards.CountriesGuard],
    resolve: { countries: fromResolvers.CountriesResolver },
    data: { corporate: true, branch: true },
  },
  {
    path: 'country/new',
    component: adminContainers.CountryItemComponent,
    canActivate: [fromGuards.CountriesGuard, fromGuards.CurrenciesGuard],
    resolve: [
      fromResolvers.CountriesResolver,
      fromResolvers.CurrenciesResolver,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: 'country/:uuid',
    component: adminContainers.CountryItemComponent,
    canActivate: [fromGuards.CountryExistsGuard, fromGuards.CurrenciesGuard],
    resolve: [
      fromResolvers.CountriesResolver,
      fromResolvers.CurrenciesResolver,
      fromResolvers.CountryExistsResolver,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: 'synchronization',
    component: adminContainers.SynchronizationItemComponent,
    data: { corporate: false, branch: true },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('admin', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
  ],
  declarations: [...adminContainers.COMPONENTS, ...adminComponents.COMPONENTS],
  exports: [...adminContainers.COMPONENTS, ...adminComponents.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class AdministrationModule {
  static forRoot(): ModuleWithProviders<AdministrationModule> {
    return {
      ngModule: AdministrationModule,
    };
  }
}
