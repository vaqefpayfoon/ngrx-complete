import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Dashboard Containers
import * as dashboardContainers from './containers';

// Dashboard Components
import * as dashboardComponents from './components';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS } from './+state';

// Facades
import * as fromFacades from './+state/facades';

// resolvers
import * as fromResolvers from './resolvers';

// Guards
import * as fromGuards from './guards';

// Ui
import { UiModule } from '@neural/ui';

// Auth Module
import * as fromAuth from '@neural/auth';

// Chart
import { PlotlyViaCDNModule } from 'angular-plotly.js';

PlotlyViaCDNModule.setPlotlyVersion('latest'); // can be `latest` or any version number (i.e.: '1.40.0')
PlotlyViaCDNModule.setPlotlyBundle('basic'); // optional: can be null (for full) or 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox' or 'finance'

const ROUTES: Routes = [
  {
    path: 'basic',
    component: dashboardContainers.BasicItemComponent,
    data: { corporate: false, branch: true },
    resolve: { dashboard: fromResolvers.DashboardResolver },
    canActivate: [fromGuards.DashboardBasicGuard, fromAuth.AuthGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('dashboard', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PlotlyViaCDNModule,
  ],
  declarations: [
    ...dashboardContainers.COMPONENTS,
    ...dashboardComponents.COMPONENTS,
  ],
  exports: [
    ...dashboardContainers.COMPONENTS,
    ...dashboardComponents.COMPONENTS,
  ],
  providers: [...fromFacades.facades, ...fromResolvers.resolvers],
})
export class DashboardModule {}
