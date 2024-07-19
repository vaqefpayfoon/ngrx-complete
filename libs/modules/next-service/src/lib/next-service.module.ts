import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as containers from './containers';
import * as components from './components';
import { RouterModule, Routes } from '@angular/router';
import { UiModule } from '@neural/ui';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EFFECTS, REDUCERS, facades } from './+state';
import * as fromResolvers from './resolvers';
import * as fromGuards from './guards';

const ROUTES: Routes = [
  {
    path: '',
    component: containers.NextServicesComponent,
    resolve: [
      fromResolvers.NextServiceResolver,
    ],
    canActivate: [fromGuards.NextServiceGuard],
    data: { corporate: false, branch: true },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('nextservices', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    ],
  declarations: [...containers.COMPONENTS, components.COMPONENTS],
  exports: [...containers.COMPONENTS, components.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class NextServiceModule {}
