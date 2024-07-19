import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Enquiries Components
import * as enquiriesComponents from './components';

// Enquiries Containers
import * as enquiriesContainers from './containers';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';

// Ui
import { UiModule } from '@neural/ui';

import { PipesModule } from '@neural/shared/util/pipes';

//resolvers
import * as fromResolvers from './resolvers';

const ROUTES: Routes = [
  {
    path: 'enquiries',
    children: [
      {
        path: 'general',
        component: enquiriesContainers.EnquiriesComponent,
        canActivate: [fromGuards.EnquiriesGuard],
        resolve: { general: fromResolvers.SupportCenterResolver },
        data: { corporate: false, branch: true },
      },
      {
        path: 'general/:uuid',
        component: enquiriesContainers.EnquiryItemComponent,
        canActivate: [fromGuards.EnquiriesGuard, fromGuards.EnquiryExistsGuard],
        resolve: [
          fromResolvers.SupportCenterResolver,
          fromResolvers.EnquiryExistsResolver,
        ],
        data: { corporate: false, branch: true },
      },
      {
        path: 'insurances',
        component: enquiriesContainers.InsuranceEnquiriesComponent,
        canActivate: [fromGuards.InsuranceEnquiriesGuard],
        resolve: { insurances: fromResolvers.InsuranceEnquiriesResolver },
        data: { corporate: false, branch: true },
      },
      {
        path: 'insurance/:uuid',
        component: enquiriesContainers.InsuranceEnquiryItemComponent,
        canActivate: [fromGuards.InsuranceEnquiryExistsGuard],
        resolve: { insurances: fromResolvers.InsuranceEnquiryExistsResolver },
        data: { corporate: false, branch: true },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('supportCenter', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    PipesModule,
  ],
  declarations: [
    ...enquiriesComponents.COMPONENTS,
    ...enquiriesContainers.COMPONENTS,
  ],
  exports: [
    ...enquiriesComponents.COMPONENTS,
    ...enquiriesContainers.COMPONENTS,
  ],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class SupportCenterModule {}
