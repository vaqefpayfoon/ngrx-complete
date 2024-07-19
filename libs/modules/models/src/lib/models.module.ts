import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Models Components
import * as modelsComponents from './components';

// Models Containers
import * as modelsContainers from './containers';

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

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: modelsContainers.ModelsComponent,
    canActivate: [fromGuards.ModelsGuard],
    resolve: { models: fromResolvers.ModelsResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'list/new',
    component: modelsContainers.ModelItemComponent,
    canActivate: [fromGuards.ModelsGuard],
    resolve: { models: fromResolvers.ModelsResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'list/:uuid',
    component: modelsContainers.ModelItemComponent,
    canActivate: [fromGuards.ModelsGuard, fromGuards.ModelExistsGuard],
    resolve: [fromResolvers.ModelsResolver, fromResolvers.ModelExistsResolver],
    data: { corporate: false, branch: true },
  },
  {
    path: 'list/config/branches',
    component: modelsContainers.ModelBranchesComponent,
    canActivate: [fromGuards.ModelsGuard, fromGuards.BrandSeriesExistsGuard],
    resolve: [
      fromResolvers.ModelsResolver,
      fromResolvers.BrandSeriesExistsResolver,
    ],
    data: { corporate: false, branch: true },
  },
  {
    path: 'list/config/series-images',
    component: modelsContainers.SeriesImagesComponent,
    canActivate: [fromGuards.ModelsGuard, fromGuards.BrandSeriesExistsGuard],
    resolve: [
      fromResolvers.ModelsResolver,
      fromResolvers.BrandSeriesExistsResolver,
    ],
    data: { corporate: false, branch: true },
  },
  {
    path: 'list/config/model-images',
    component: modelsContainers.ModelsImageItemComponent,
    canActivate: [fromGuards.ModelsGuard, fromGuards.BrandSeriesExistsGuard],
    resolve: [
      fromResolvers.ModelsResolver,
      fromResolvers.BrandSeriesExistsResolver,
    ],
    data: { corporate: false, branch: true },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('models', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
  ],
  declarations: [
    ...modelsComponents.COMPONENTS,
    ...modelsContainers.COMPONENTS,
  ],
  exports: [...modelsComponents.COMPONENTS, ...modelsContainers.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class ModelsModule {}
