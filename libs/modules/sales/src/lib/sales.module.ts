import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Sales Components
import * as salesComponents from './components';

// Sales Containers
import * as salesContainers from './containers';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';

import * as fromResolvers from './resolvers';

// Ui
import { UiModule } from '@neural/ui';

import { PipesModule } from '@neural/shared/util/pipes';

import { GoogleLocationModule } from '@neural/shared/google-location';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';

import * as salesPipes from './pipes';

import * as salesDirective from './directives';

const ROUTES: Routes = [
  {
    path: 'purchases',
    component: salesContainers.PurchasesComponent,
    canActivate: [fromGuards.PurchasesGuard],
    resolve: { purchases: fromResolvers.PurchasesResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: 'purchase/:uuid',
    component: salesContainers.PurchaseItemComponent,
    data: { corporate: false, branch: false },
    canActivate: [
      fromGuards.PurchaseExistsGuard,
      fromGuards.BankLoansBySaleGuard,
    ],
    resolve: [
      fromResolvers.PurchaseExistsResolver,
      fromResolvers.BankLoansBySaleResolver,
    ],
  },
  {
    path: 'purchase-quotes',
    component: salesContainers.PurchaseQuotesComponent,
    data: { corporate: false, branch: false },
    canActivate: [fromGuards.PurchaseQuotesGuard],
    resolve: [fromResolvers.PurchaseQuotesResolver],
  },
  {
    path: 'purchase-quote/:uuid',
    component: salesContainers.PurchaseQuoteItemComponent,
    data: { corporate: false, branch: false },
    canActivate: [
      fromGuards.PurchaseQuoteExistsGuard,
      fromGuards.BankLoansBySaleGuard,
    ],
    resolve: [
      fromResolvers.PurchaseQuoteExistsResolver,
      fromResolvers.BankLoansByQuotesResolver,
    ],
  },
  {
    path: 'valuations',
    component: salesContainers.ValuationsComponent,
    data: { corporate: false, branch: false },
  },
  {
    path: 'valuation',
    component: salesContainers.ValuationItemComponent,
    data: { corporate: false, branch: false },
  },
];

@NgModule({
  imports: [
    GoogleLocationModule,
    CommonModule,
    RouterModule.forChild(ROUTES),
    UiModule,
    StoreModule.forFeature('sales', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
  ],
  declarations: [
    ...salesComponents.COMPONENTS,
    ...salesContainers.COMPONENTS,
    ...salesPipes.PIPES,
    ...salesDirective.COMPONENTS,
  ],
  exports: [...salesComponents.COMPONENTS, ...salesContainers.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class SalesModule {}
