import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Vehicles Components
import * as vehiclesComponents from './components';

// Vehicles Containers
import * as vehiclesContainers from './containers';

// Ui
import { UiModule } from '@neural/ui';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

// Guards
import * as fromGuards from './guards';
import { AuthGuard } from '@neural/auth';

// Directive
import { DirectivesModule } from '@neural/shared/util/directives';

// Service Module
import { ServicesModule } from '@neural/modules/customer/services';

//Models
import { IVehicle } from './models';

//Resolvers
import * as fromResolvers from './resolvers';
const ROUTES: Routes = [
  {
    path: '',
    component: vehiclesContainers.VehiclesComponent,
    canActivate: [AuthGuard, fromGuards.VehiclesGuard],
    resolve: { vehicles: fromResolvers.VehiclesResolver },
    data: { corporate: false, branch: true, type: IVehicle.VehicleType.ALL },
  },
  {
    path: 'search',
    component: vehiclesContainers.VehicleItemComponent,
    canActivate: [AuthGuard, fromGuards.VehiclesGuard],
    resolve: { vehicles: fromResolvers.VehiclesResolver },
    data: { corporate: false, branch: true, type: IVehicle.VehicleType.SEARCH },
  },
  {
    path: 'references',
    component: vehiclesContainers.VehicleReferencesComponent,
    canActivate: [
      AuthGuard,
      fromGuards.VehicleReferencesGuard,
      fromGuards.BrandsFlatRateUnitGuard,
    ],
    resolve: { vehicles: fromResolvers.VehicleReferencesResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'reference/new',
    component: vehiclesContainers.VehicleReferenceItemComponent,
    canActivate: [AuthGuard, fromGuards.VehicleReferencesGuard],
    resolve: { vehicles: fromResolvers.VehicleReferencesResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'reference/:uuid',
    component: vehiclesContainers.VehicleReferenceItemComponent,
    canActivate: [
      AuthGuard,
      fromGuards.VehicleReferencesGuard,
      fromGuards.VehicleReferenceExistsGuard,
    ],
    resolve: [
      fromResolvers.VehicleReferencesResolver,
      fromResolvers.VehicleReferencesExistResolver,
    ],
    data: { corporate: false, branch: true },
  },
  {
    path: 'brandsfru/set',
    component: vehiclesContainers.BrandsFlatRateUnitItemComponent,
    canActivate: [AuthGuard, fromGuards.BrandsFlatRateUnitGuard],
    resolve: { branfsfru: fromResolvers.BrandsFlatRateUnitResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: ':uuid',
    component: vehiclesContainers.VehicleItemComponent,
    canActivate: [
      fromGuards.VehiclesGuard,
      fromGuards.VehicleExistsGuard,
      AuthGuard,
    ],
    resolve: [
      fromResolvers.VehiclesResolver,
      fromResolvers.VehicleExistsResolver,
    ],
    data: { corporate: false, branch: true },
  },
];

@NgModule({
  imports: [
    ServicesModule,
    CommonModule,
    UiModule,
    DirectivesModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('vehicles', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
  ],
  declarations: [
    ...vehiclesComponents.COMPONENTS,
    ...vehiclesContainers.COMPONENTS,
  ],
  exports: [...vehiclesComponents.COMPONENTS, ...vehiclesContainers.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class VehiclesModule {}
