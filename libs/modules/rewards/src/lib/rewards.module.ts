import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Router
import { RouterModule, Routes } from '@angular/router';

// rewards Components
import * as rewardsComponents from './components';

// rewards Containers
import * as rewardsContainers from './containers';

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

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'voucher',
    pathMatch: 'full',
  },
  {
    path: 'voucher',
    component: rewardsContainers.PromotionsComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.PromotionsGuard],
    resolve: { promotions: fromResolvers.PromotionsResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'voucher/new',
    component: rewardsContainers.PromotionItemComponent,
    canActivate: [fromAuth.AuthGuard],
    data: { corporate: false, branch: true },
  },
  {
    path: 'voucher/:uuid',
    component: rewardsContainers.PromotionItemComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.PromotionsGuard,
      fromGuards.PromotionExistsGuard,
    ],
    resolve: [
      fromResolvers.PromotionsResolver,
      fromResolvers.PromotionExistsResolver,
    ],
    data: { corporate: false, branch: true },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('rewards', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
  ],
  declarations: [
    ...rewardsComponents.COMPONENTS,
    ...rewardsContainers.COMPONENTS,
  ],
  exports: [...rewardsContainers.COMPONENTS, ...rewardsComponents.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class RewardsModule {}
