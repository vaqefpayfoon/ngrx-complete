import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Corporates Components
import * as fleetsComponents from './components';

// Corporates Containers
import * as fleetsContainers from './containers';

// Ui
import { UiModule } from '@neural/ui';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

// Guards
import * as fromGuards from './guards';

//Resolvers
import * as fromResolvers from './resolvers';

// Auth
import * as fromAuth from '@neural/auth';

// Pipes
import { PipesModule } from '@neural/shared/util/pipes';

const ROUTES: Routes = [
  {
    path: '',
    component: fleetsContainers.FleetsComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.FleetsGuard],
    resolve: { fleet: fromResolvers.FleetsResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: 'new',
    component: fleetsContainers.FleetItemComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.FleetsGuard],
    resolve: { fleet: fromResolvers.FleetsResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: ':uuid',
    component: fleetsContainers.FleetItemComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.FleetsGuard,
      fromGuards.FleetExistsGuard,
    ],
    resolve: [fromResolvers.FleetsResolver, fromResolvers.FleetExistsResolver],
    data: { corporate: false, branch: false },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('fleets', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
  ],
  declarations: [
    ...fleetsComponents.COMPONENTS,
    ...fleetsContainers.COMPONENTS,
  ],
  exports: [...fleetsComponents.COMPONENTS, ...fleetsContainers.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class FleetsModule {}
