import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Business Components
import * as businessComponents from './components';

// Business Containers
import * as businessContainers from './containers';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

// Guards
import * as fromGuards from './guards';

// Ui
import { UiModule } from '@neural/ui';

//Resolvers
import * as fromResolvers from './resolvers';

const ROUTES: Routes = [
  {
    path: '',
    component: businessContainers.BusinessesComponent,
    canActivate: [fromGuards.BusinessesGuard],
    resolve: { businesses: fromResolvers.BusinessesResolver },
    data: { corporate: true, branch: true },
  },
  {
    path: 'new',
    component: businessContainers.BusinessItemComponent,
    canActivate: [fromGuards.BusinessesGuard],
    resolve: { businesses: fromResolvers.BusinessesResolver },
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid',
    component: businessContainers.BusinessItemComponent,
    canActivate: [fromGuards.BusinessesGuard, fromGuards.BusinessExistsGuard],
    resolve: [
      fromResolvers.BusinessesResolver,
      fromResolvers.BusinessExistsResolver,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: 'associate/:uuid',
    component: businessContainers.BusinessAssociateComponent,
    canActivate: [fromGuards.BusinessesGuard, fromGuards.BusinessExistsGuard],
    resolve: [
      fromResolvers.BusinessesResolver,
      fromResolvers.BusinessExistsResolver,
    ],
    data: { corporate: true, branch: true },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('business', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
  ],
  declarations: [
    ...businessContainers.COMPONENTS,
    ...businessComponents.COMPONENTS,
  ],
  exports: [...businessContainers.COMPONENTS, ...businessComponents.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class BusinessModule {}
