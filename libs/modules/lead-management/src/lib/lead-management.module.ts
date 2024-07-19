import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, Routes } from '@angular/router';

import * as containers from './containers';
import * as components from './components';
import * as salesDirective from './directives';

import * as fromResolvers from './resolvers';
import * as fromGuards from './guards';

import { UiModule } from '@neural/ui';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PipesModule } from '@neural/shared/util/pipes';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { EFFECTS, REDUCERS, facades } from './+state';

export const leadManagementRoutes: Route[] = [];

const ROUTES: Routes = [
  {
    path: 'leadList',
    component: containers.LeadListComponent,
    resolve: [
      fromResolvers.LeadManagementResolver,
    ],
    canActivate: [fromGuards.LeadManagementGuard],
    data: { corporate: false, branch: true },
  },
  {
    path: 'leadList/new',
    component: components.LeadComponent,
    resolve: [
      fromResolvers.GlobalBrandsResolver
    ],
    canActivate: [fromGuards.LeadManagementCreateGuard],
    data: { corporate: false, branch: true },
  },
  {
    path: 'leadItem/:uuid',
    component: containers.LeadItemComponent,
    resolve: [
      fromResolvers.LeadExistsResolver,
      fromResolvers.WishListExistsResolver,
      fromResolvers.PurchaseQuoteResolver,
      fromResolvers.GlobalBrandsResolver,
      fromResolvers.TestDriveExistsResolver
    ],
    canActivate: [fromGuards.LeadExistsGuard],
    data: { corporate: false, branch: true },
  },
]
@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('leads', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
  ],
  declarations: [
    ...containers.COMPONENTS,
    ...components.COMPONENTS,
    ...salesDirective.COMPONENTS,
  ],
  exports: [...components.COMPONENTS, ...containers.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class LeadManagementModule {}
