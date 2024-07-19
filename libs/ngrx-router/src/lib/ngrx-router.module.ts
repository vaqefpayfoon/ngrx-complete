import { NgModule, Self, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Router
import { Router } from '@angular/router';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
  RouterState, DefaultRouterStateSerializer
} from '@ngrx/router-store';

// Router States
import { EFFECTS } from './+state';

import { CustomSerializer } from './+state/reducers/router.reducer';

import { REDUCERS } from './+state/reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('router', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer, stateKey: 'router' })
  ],
  exports: [StoreModule, StoreRouterConnectingModule, EffectsModule],
  providers: [
    EFFECTS,
    [{ provide: RouterStateSerializer, useClass: CustomSerializer }]
  ]
})
export class NgrxRouterModule {
  constructor(@Self() @Optional() router: Router) {
    if (router) {
      // console.log('All good, NgrxRouterStoreModule');
    } else {
      console.error(
        'All good, NgrxRouterStoreModule must be imported in the same same level as RouterModule'
      );
    }
  }
}
