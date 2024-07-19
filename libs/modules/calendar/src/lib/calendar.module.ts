import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// UI Module (Material)
import { UiModule } from '@neural/ui';

// Containers
import * as calendarContainers from './containers';

// Components
import * as calendarComponents from './components';

// Guards
import * as fromGuards from './guards';

//Resolvers
import * as fromResolvers from './resolvers';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import { SwiperModule } from 'ngx-swiper-wrapper';

const ROUTES: Routes = [
  {
    path: '',
    component: calendarContainers.CalendarsComponent,
    canActivate: [fromGuards.CalendarsGuard],
    resolve: { calendars: fromResolvers.CalendarsResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: 'new',
    component: calendarContainers.CalendarItemComponent,
    data: { corporate: false, branch: false },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('manual-calendars', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    SwiperModule,
  ],
  declarations: [
    ...calendarContainers.COMPONENTS,
    ...calendarComponents.COMPONENTS,
  ],
  exports: [...calendarContainers.COMPONENTS, ...calendarComponents.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class CalendarModule {}
