import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// UI Module (Material)
import { UiModule } from '@neural/ui';

// Layout Module
import { LayoutModule } from '@neural/layout';

// Containers
import * as coreContainers from './containers';

// Components
import * as coreComponents from './components';

// interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  TokenInterceptor,
  HttpErrorInterceptor,
  LoaderInterceptor,
} from './interceptors';

// Auth
import { AuthModule, AuthGuard } from '@neural/auth';

// Routes
export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/app/home/basic',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: coreContainers.LayoutComponent,
    canActivate: [AuthGuard],
    data: { corporate: true, branch: true },
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('@neural/modules/dashboard').then(
            (mod) => mod.DashboardModule
          ),
        canLoad: [AuthGuard],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@neural/modules/profile').then((mod) => mod.ProfileModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'administration',
        loadChildren: () =>
          import('@neural/modules/administration').then(
            (mod) => mod.AdministrationModule
          ),
        canLoad: [AuthGuard],
      },
      {
        path: 'marketing',
        loadChildren: () =>
          import('@neural/modules/marketing').then(
            (mod) => mod.MarketingModule
          ),
        canLoad: [AuthGuard],
      },
      {
        path: 'rewards',
        loadChildren: () =>
          import('@neural/modules/rewards').then((mod) => mod.RewardsModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'pre-owned',
        children: [
          {
            path: 'inventory',
            loadChildren: () =>
              import('@neural/modules/pre-owned/inventory').then(
                (mod) => mod.InventoryModule
              ),
            canLoad: [AuthGuard],
          },
        ],
      },
      {
        path: 'configuration',
        children: [
          {
            path: 'templates',
            loadChildren: () =>
              import('@neural/modules/template').then(
                (mod) => mod.TemplateModule
              ),
            canLoad: [AuthGuard],
          },
        ],
      },
      {
        path: 'support-center',
        loadChildren: () =>
          import('@neural/modules/support-center').then(
            (mod) => mod.SupportCenterModule
          ),
        canLoad: [AuthGuard],
      },
      {
        path: 'customer',
        children: [
          {
            path: 'vehicles',
            loadChildren: () =>
              import('@neural/modules/customer/vehicles').then(
                (mod) => mod.VehiclesModule
              ),
            canLoad: [AuthGuard],
          },
          {
            path: 'corporates',
            loadChildren: () =>
              import('@neural/modules/customer/corporate').then(
                (mod) => mod.CorporateModule
              ),
            canLoad: [AuthGuard],
          },
          {
            path: 'businesses',
            loadChildren: () =>
              import('@neural/modules/business').then(
                (mod) => mod.BusinessModule
              ),
            canLoad: [AuthGuard],
          },
        ],
      },
      {
        path: 'hub',
        children: [
          {
            path: 'services',
            loadChildren: () =>
              import('@neural/modules/customer/services').then(
                (mod) => mod.ServicesModule
              ),
            canLoad: [AuthGuard],
          },
          {
            path: 'reservations',
            loadChildren: () =>
              import('@neural/modules/jobs').then((mod) => mod.JobsModule),
            canLoad: [AuthGuard],
          },
          {
            path: 'fleets',
            loadChildren: () =>
              import('@neural/modules/customer/fleets').then(
                (mod) => mod.FleetsModule
              ),
            canLoad: [AuthGuard],
          },
          {
            path: 'sales',
            loadChildren: () =>
              import('@neural/modules/sales').then((mod) => mod.SalesModule),
            canLoad: [AuthGuard],
          },
          {
            path: 'lead',
            loadChildren: () =>
              import('@neural/modules/lead-management').then((mod) => mod.LeadManagementModule),
            canLoad: [AuthGuard],
          },
          {
            path: 'service-menu',
            loadChildren: () =>
              import('@neural/modules/service-menu').then((mod) => mod.ModulesServiceMenuModule),
            canLoad: [AuthGuard],
          },
          {
            path: 'nextService',
            loadChildren: () =>
              import('@neural/modules/next-service').then((mod) => mod.NextServiceModule),
            canLoad: [AuthGuard],
          },
          {
            path: 'test-drives',
            loadChildren: () =>
              import('@neural/modules/test-drive').then(
                (mod) => mod.TestDriveModule
              ),
            canLoad: [AuthGuard],
          },
          {
            path: 'calendar',
            loadChildren: () =>
              import('@neural/modules/calendar').then(
                (mod) => mod.CalendarModule
              ),
            canLoad: [AuthGuard],
          },
        ],
      },
      {
        path: 'marketplaces',
        loadChildren: () =>
          import('@neural/modules/marketplaces').then(
            (mod) => mod.MarketplacesModule
          ),
        canLoad: [AuthGuard],
      },
      {
        path: 'models',
        loadChildren: () =>
          import('@neural/modules/models').then((mod) => mod.ModelsModule),
        canLoad: [AuthGuard],
      },
    ],
  },
  { path: '404', component: coreContainers.NotFoundComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    AuthModule.forRoot(),
    LayoutModule.forRoot(),
    RouterModule.forChild(ROUTES),
  ],
  declarations: [...coreContainers.COMPONENTS, ...coreComponents.COMPONENTS],
  exports: [...coreContainers.COMPONENTS, ...coreComponents.COMPONENTS],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
    };
  }
}
