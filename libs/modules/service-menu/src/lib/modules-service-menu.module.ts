import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Router
import { RouterModule, Routes } from '@angular/router';

import * as serviceComponents from './components';

import * as serviceContainers from './containers';

// Auth Guard
import * as fromAuth from '@neural/auth';

// Ui
import { UiModule } from '@neural/ui';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';

import { PipesModule } from '@neural/shared/util/pipes';

//Resolvers
import * as fromResolvers from './resolvers';
import { TwoDigitDecimaNumberDirective } from './directives/two-decimal.directive';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ServiceLineSearchComponent } from './components/service-line-search/service-line-search.component';

const ROUTES: Routes = [
  {
    path: 'service-line',
    children: [
      {
        path: 'list',
        component: serviceContainers.ServiceLineListComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.ServiceLineGuard],
        resolve: [
          fromResolvers.ServiceLineResolver,
          fromResolvers.BranchResolver,
          fromResolvers.ServiceTypesResolver,
        ],
        data: { corporate: false, branch: false },
      },
      {
        path: 'new',
        component: serviceContainers.ServiceLineItemComponent,
        canActivate: [fromAuth.AuthGuard],
        resolve: [
          fromResolvers.GlobalBrandsResolver,
          fromResolvers.ServiceTypesResolver,
          fromResolvers.CorporateResolver,
          fromResolvers.BranchResolver
        ],
        data: { corporate: false, branch: true },
      },
      {
        path: 'list/:uuid',
        component: serviceContainers.ServiceLineItemComponent,
        canActivate: [
          fromAuth.AuthGuard,
        ],
        resolve: [
          fromResolvers.ServiceLineExistsResolver,
          fromResolvers.GlobalBrandsResolver,
          fromResolvers.ServiceTypesResolver,
          fromResolvers.CorporateResolver,
          fromResolvers.BranchResolver
        ],
        data: { corporate: false, branch: true },
      },
    ],
  },
  {
    path: 'service-package',
    children: [
      {
        path: 'list',
        component: serviceContainers.ServicePackageListComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.ServicePackageGuard],
        resolve: [
          fromResolvers.ServicePackageResolver,
          fromResolvers.BranchInfoResolver
        ],
        data: { corporate: false, branch: false },
      },
      {
        path: 'new',
        component: serviceContainers.ServicePackageItemComponent,
        canActivate: [fromAuth.AuthGuard],
        resolve: [
          fromResolvers.PackageBrandsResolver,
          fromResolvers.PackageServiceLineResolver,
          fromResolvers.CorporateResolver,
          fromResolvers.BranchInfoResolver
        ],
        data: { corporate: false, branch: true },
      },
      {
        path: 'list/:uuid',
        component: serviceContainers.ServicePackageItemComponent,
        canActivate: [
          fromAuth.AuthGuard,
        ],
        resolve: [
          fromResolvers.ServicePackageExistsResolver,
          fromResolvers.PackageBrandsResolver,
          fromResolvers.PackageServiceLineResolver,
          fromResolvers.CorporateResolver,
          fromResolvers.BranchInfoResolver
        ],
        data: { corporate: false, branch: true },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('serviceMenu', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
  ],
  declarations: [
    ...serviceComponents.COMPONENTS,
    ...serviceContainers.COMPONENTS,
    TwoDigitDecimaNumberDirective,
    ConfirmModalComponent,
    ServiceLineSearchComponent
  ],
  exports: [...serviceContainers.COMPONENTS, ...serviceComponents.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class ModulesServiceMenuModule {}
