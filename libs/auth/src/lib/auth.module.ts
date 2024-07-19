import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Containers
import * as authComponents from './components';

// Containers
import * as authContainers from './containers';

// Material UI
import { UiModule } from '@neural/ui';

// Services & Guards
import * as fromServices from './services';
import * as fromGuards from './guards';

// NgRx State
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS } from './+state';
import * as fromFacades from './+state/facades';

// Routing Providers
export const ROUTES: Routes = [
  {
    path: 'login',
    component: authContainers.LoginComponent,
    canActivate: [fromGuards.LoginGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    UiModule,
    StoreModule.forFeature('auth', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
  ],
  declarations: [...authContainers.COMPONENTS, ...authComponents.COMPONENTS],
  exports: [...authContainers.COMPONENTS, ...authComponents.COMPONENTS],
  providers: [
    ...fromServices.services,
    ...fromGuards.guards,
    ...fromFacades.facades,
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
    };
  }
}
