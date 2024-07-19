import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import * as insurerContainers from './containers';
import * as insurerComponets from './components';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';

import * as fromResolvers from './resolvers';

// Ui
import { UiModule } from '@neural/ui';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    StoreModule.forFeature('insurance', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    RouterModule.forChild([
      {
        path: '',
        component: insurerContainers.InsurersComponent,
        canActivate: [fromGuards.InsurerGuard],
        resolve: { insurers: fromResolvers.InsurerResolver },
        data: { corporate: true, branch: true },
      },
      {
        path: 'new',
        component: insurerContainers.InsurerItemComponent,
        canActivate: [fromGuards.InsurerGuard],
        resolve: { insurers: fromResolvers.InsurerResolver },
        data: { corporate: true, branch: true },
      },
      {
        path: ':uuid',
        component: insurerContainers.InsurerItemComponent,
        canActivate: [fromGuards.InsurerExistsGuard],
        resolve: { insurer: fromResolvers.InsurerExistsResolver },
        data: { corporate: true, branch: true },
      },
    ]),
  ],
  declarations: [
    ...insurerContainers.COMPONENTS,
    ...insurerComponets.COMPONENTS,
  ],
  exports: [...insurerContainers.COMPONENTS, ...insurerComponets.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class InsurerModule {}
