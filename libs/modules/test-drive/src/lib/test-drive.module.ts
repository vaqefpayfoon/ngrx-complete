import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Test drives Components
import * as testDrivesComponents from './components';

// Test drives Containers
import * as testDrivesContainers from './containers';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

//Guards
import * as fromGuards from './guards';

//Resolvers
import * as fromResolvers from './resolver';

// Ui
import { UiModule } from '@neural/ui';

import { PipesModule } from '@neural/shared/util/pipes';

const ROUTES: Routes = [
  {
    path: '',
    component: testDrivesContainers.TestDrivesComponent,
    canActivate: [fromGuards.TestDrivesGuard],
    resolve: [fromResolvers.TestDrivesResolver, fromResolvers.TestDriveBranchResolver] ,
    data: { corporate: false, branch: false },
  },
  {
    path: ':uuid',
    component: testDrivesContainers.TestDriveItemComponent,
    canActivate: [fromGuards.TestDrivesGuard, fromGuards.TestDriveExistsGuard],
    resolve: [
      fromResolvers.TestDrivesResolver,
      fromResolvers.TestDriveExistsResolver,
      fromResolvers.TestDriveBranchResolver
    ],
    data: { corporate: false, branch: false },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('testDrivesModule', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
  ],
  declarations: [
    ...testDrivesComponents.COMPONENTS,
    ...testDrivesContainers.COMPONENTS,
  ],
  exports: [
    ...testDrivesComponents.COMPONENTS,
    ...testDrivesContainers.COMPONENTS,
  ],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class TestDriveModule {}
