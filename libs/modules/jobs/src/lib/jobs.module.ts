import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Router
import { RouterModule, Routes } from '@angular/router';

// Jobs Components
import * as jobsComponents from './components';

// Jobs Containers
import * as jobsContainers from './containers';

// NgRx Module
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// NgRx Effects
import { EFFECTS, REDUCERS } from './+state';

// NgRx Facades
import * as fromFacades from './+state/facade';

// Angular Guards
import * as fromGuards from './guards';

//Resolvers
import * as fromResolvers from './resolvers';

// Auth Guard
import * as fromAuth from '@neural/auth';

// Ui
import { UiModule } from '@neural/ui';

// Model
import { ICalendar } from './models';
import { CalendarModule } from '@neural/modules/calendar';

const ROUTES: Routes = [
  {
    path: 'mobile',
    children: [
      {
        path: 'scheduled',
        component: jobsContainers.CompletedComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.CompletedGuard],
        resolve: { completed: fromResolvers.CompletedResolver },
      },
      {
        path: 'scheduled/:uuid',
        component: jobsContainers.CompletedItemComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.CompletedExistsGuard],
        resolve: { completed: fromResolvers.CompletedExistsResolver },
      },
      {
        path: 'scheduled/:uuid/assign',
        component: jobsContainers.ReservationActionsComponent,
        canActivate: [
          fromAuth.AuthGuard,
          fromGuards.CompletedGuard,
          fromGuards.CompletedExistsGuard,
          fromGuards.BranchTeamsGuard,
        ],
        resolve: [
          fromResolvers.CompletedResolver,
          fromResolvers.CompletedExistsResolver,
          fromResolvers.BranchTeamsResolver,
        ],
      },
      {
        path: 'rescheduled/:uuid',
        component: jobsContainers.MobileRescheduleComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.CompletedGuard],
        resolve: { completed: fromResolvers.CompletedResolver },
        data: {
          types: [ICalendar.CalendarType.MOBILITY],
        },
      },
      {
        path: 'declined',
        component: jobsContainers.ReservationsComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.ReservationsGuard],
        resolve: { reservations: fromResolvers.ReservationsResolver },
      },
      {
        path: 'declined/:uuid',
        component: jobsContainers.ReservationItemComponent,
        canActivate: [
          fromAuth.AuthGuard,
          fromGuards.ReservationsGuard,
          fromGuards.ReservationExistsGuard,
        ],
        resolve: [
          fromResolvers.ReservationsResolver,
          fromResolvers.ReservationExistsResolver,
        ],
      },
    ],
  },
  {
    path: 'in-progress',
    component: jobsContainers.InProgressItemComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.InProgressGuard],
    resolve: [
      fromResolvers.InProgressResolver,
      fromResolvers.InProgressListResolver,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: 'service-center',
    children: [
      {
        path: 'scheduled',
        component: jobsContainers.ServicesCenterScheduledComponent,
        canActivate: [
          fromAuth.AuthGuard,
          // fromGuards.ServiceCenterScheduledGuard,
        ],
        // resolve: { scheduled: fromResolvers.ServiceCenterScheduledResolver },
      },
      {
        path: 'scheduled/:uuid',
        component: jobsContainers.ServiceCenterScheduledItemComponent,
        canActivate: [
          fromAuth.AuthGuard,
          fromGuards.ServiceCenterScheduledExistsGuard,
        ],
        resolve: {
          scheduled: fromResolvers.ServiceCenterScheduledExistsResolver,
        },
      },
      {
        path: 'scheduled/:uuid/assign',
        component: jobsContainers.ServiceCenterReservationActionsComponent,
        canActivate: [
          fromAuth.AuthGuard,
          // fromGuards.ServiceCenterScheduledGuard,
          fromGuards.ServiceCenterScheduledExistsGuard,
          fromGuards.BranchTeamsGuard,
        ],
        resolve: [
          // fromResolvers.ServiceCenterScheduledResolver,
          fromResolvers.ServiceCenterScheduledExistsResolver,
          fromResolvers.BranchTeamsResolver,
        ],
      },
      {
        path: 'new/:iso/:type/:exist/:sa',
        component: jobsContainers.NewManualReservationComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.ReservationsGuard],
        resolve: [
          // fromResolvers.ServiceCenterScheduledResolver,
          // fromResolvers.VehicleMakesResolver,
        ],
      },
      {
        path: 'reserve/:uuid/:tag',
        component: jobsContainers.ManualReservationItemComponent,
        canActivate: [fromGuards.ManualReservationExistsGuard],
        resolve: [
          fromResolvers.ManualReservationExistsResolver,
          // fromResolvers.VehicleMakesResolver,
        ],
        data: { corporate: false, branch: false },
      },

      {
        path: 'rescheduled/:uuid',
        component: jobsContainers.ServiceCenterRescheduleComponent,
        canActivate: [
          fromAuth.AuthGuard,
          fromGuards.ManualReservationExistsGuard,
        ],
        resolve: { scheduled: fromResolvers.ManualReservationExistsResolver },
        data: {
          types: [
            ICalendar.CalendarType.REPAIR,
            ICalendar.CalendarType.SERVICE,
          ],
        },
      },
      {
        path: 'declined',
        component: jobsContainers.ServicesCenterDeclinedComponent,
        canActivate: [
          fromAuth.AuthGuard,
          fromGuards.ServiceCenterDeclinedGuard,
        ],
        resolve: { declined: fromResolvers.ServiceCenterDeclinedResolver },
      },
      {
        path: 'declined/:uuid',
        component: jobsContainers.ServiceCenterDeclinedItemComponent,
        canActivate: [
          fromAuth.AuthGuard,
          fromGuards.ServiceCenterDeclinedGuard,
          fromGuards.ServiceCenterDeclinedExistsGuard,
        ],
        resolve: [
          fromResolvers.ServiceCenterDeclinedResolver,
          fromResolvers.ServiceCenterDeclinedExistsResolver,
        ],
      },
    ],
  },
  {
    path: 'reminders',
    children: [
      {
        path: '',
        component: jobsContainers.WarrantiesComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.WarrantyGuard],
        resolve: { warranty: fromResolvers.WarrantyResolver },
      },
      {
        path: 'new',
        component: jobsContainers.WarrantyItemComponent,
        canActivate: [fromAuth.AuthGuard, fromGuards.WarrantyGuard],
        resolve: { warranty: fromResolvers.WarrantyResolver },
      },
      {
        path: ':uuid',
        component: jobsContainers.WarrantyItemComponent,
        canActivate: [
          fromAuth.AuthGuard,
          fromGuards.WarrantyGuard,
          fromGuards.WarrantyExistsGuard,
        ],
        resolve: [
          fromResolvers.WarrantyResolver,
          fromResolvers.WarrantyExistsResolver,
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('reservations', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    // AdministrationModule.forRoot()
    CalendarModule,
  ],
  declarations: [
    ...jobsContainers.COMPONENTS,
    ...jobsComponents.COMPONENTS,
  ],
  exports: [...jobsContainers.COMPONENTS, ...jobsComponents.COMPONENTS],
  providers: [...fromFacades.facades, ...fromResolvers.resolvers],
})
export class JobsModule {}
