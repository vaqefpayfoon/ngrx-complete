import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Corporates Components
import * as corporatesComponents from './components';

// Corporates Containers
import * as corporatesContainers from './containers';

// Ui
import { UiModule } from '@neural/ui';
import * as fromResolvers from './resolvers';
// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';

// Directive
import { DirectivesModule } from '@neural/shared/util/directives';

import * as corporatePipes from './pipes';

const ROUTES: Routes = [
  {
    path: '',
    component: corporatesContainers.CorporatesComponent,
    canActivate: [fromGuards.CorporatesGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: 'branches',
    component: corporatesContainers.BranchesComponent,
    resolve: {
      branches: fromResolvers.BranchesResolver
    },
    data: { corporate: false, branch: true },
  },
  {
    path: 'branches/:cUuid/:uuid',
    component: corporatesContainers.BranchItemComponent,
    resolve: [
      fromResolvers.GlobalBrandsResolver,
    ],
    canActivate: [fromGuards.BranchExistsGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: 'new',
    component: corporatesContainers.CorporateItemComponent,
    canActivate: [fromGuards.CorporatesGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid',
    component: corporatesContainers.CorporateItemComponent,
    canActivate: [
      fromGuards.CorporatesGuard,
      fromGuards.CorporateExistsGuard,
      fromGuards.BranchesGuard,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid/branch/new',
    component: corporatesContainers.BranchItemComponent,
    resolve: [
      fromResolvers.GlobalBrandsResolver,
    ],
    canActivate: [fromGuards.BranchesGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: 'branches/:cUuid/:uuid/schedules',
    component: corporatesContainers.SchedularsComponent,
    canActivate: [fromGuards.BranchesGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: 'branches/:cUuid/:uuid/schedules/:scheduleUuid',
    component: corporatesContainers.SchedulesTeamsComponent,
    data: { corporate: true, branch: true },
  },
  {
    path: 'branches/:cUuid/:uuid/schedules/offdays/new',
    component: corporatesContainers.SchedulesOffDaysItemComponent,
    data: { corporate: true, branch: true },
    resolve: [
      fromResolvers.OperationsResolver
    ],
  },
  {
    path: 'branches/:cUuid/:uuid/schedules/offdays/:offDaysUuid',
    component: corporatesContainers.SchedulesOffDaysItemComponent,
    data: { corporate: true, branch: true },
    resolve: [
      fromResolvers.OperationsResolver
    ],
  },
  {
    path: 'branches/:cUuid/:uuid/schedules/:scheduleUuid/:teamUuid',
    component: corporatesContainers.SchedularTeamItemComponent,
    resolve: [
      fromResolvers.GlobalBrandsResolver,
      fromResolvers.OperationsResolver,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid/app',
    component: corporatesContainers.CorporateAppsComponent,
    canActivate: [fromGuards.CorporateExistsGuard, fromGuards.AppsGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid/app/new',
    component: corporatesContainers.CorporateAppItemComponent,
    canActivate: [fromGuards.CorporateExistsGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid/app/:uuid',
    component: corporatesContainers.CorporateAppItemComponent,
    canActivate: [fromGuards.AppsGuard, fromGuards.AppExistsGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid/agreement',
    component: corporatesContainers.AgreementsComponent,
    canActivate: [fromGuards.CorporateExistsGuard, fromGuards.AgreementsGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid/agreement/new',
    component: corporatesContainers.AgreementItemComponent,
    canActivate: [fromGuards.CorporateExistsGuard, fromGuards.AgreementsGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: ':uuid/agreement/:uuid',
    component: corporatesContainers.AgreementItemComponent,
    canActivate: [fromGuards.AgreementsGuard, fromGuards.AgreementExistsGuard],
    data: { corporate: true, branch: true },
  },
  {
    path: 'insurers/:uuid',
    loadChildren: () =>
      import('@neural/modules/insurer').then((mod) => mod.InsurerModule),
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DirectivesModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('corporates', REDUCERS),
    EffectsModule.forFeature(EFFECTS)
  ],
  declarations: [
    ...corporatesComponents.COMPONENTS,
    ...corporatesContainers.COMPONENTS,
    ...corporatePipes.PIPES,
  ],
  exports: [
    ...corporatesComponents.COMPONENTS,
    ...corporatesContainers.COMPONENTS,
  ],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class CorporateModule {}
