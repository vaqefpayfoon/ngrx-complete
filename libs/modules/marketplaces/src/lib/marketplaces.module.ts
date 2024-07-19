import { NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Market Places Components
import * as marketplacesComponents from './components';

// Market Places Containers
import * as marketplacesContainers from './containers';

// Ui
import { UiModule } from '@neural/ui';

// NgRx Module
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// States
import { EFFECTS, REDUCERS } from './+state';

// Guards
import * as fromGuards from './guards';

//Resolvers
import * as fromResolvers from './resolvers';

// Auth
import * as fromAuth from '@neural/auth';

// Facades
import * as fromFacades from './+state/facades';

// Load Services Module
import {
  ServicesModule,
  ServicesGuard,
} from '@neural/modules/customer/services';

// CK Editor
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';

import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';

const ROUTES: Routes = [
  {
    path: 'references',
    component: marketplacesContainers.ProductReferencesComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.ProductReferencesGuard],
    resolve: { references: fromResolvers.ProductReferencesResolver },
    data: { corporate: true, branch: true },
  },
  {
    path: 'reference/new',
    component: marketplacesContainers.ProductReferenceItemComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.ProductReferencesGuard],
    resolve: { references: fromResolvers.ProductReferencesResolver },
    data: { corporate: true, branch: true },
  },
  {
    path: 'reference/:uuid',
    component: marketplacesContainers.ProductReferenceItemComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.ProductReferencesGuard,
      fromGuards.ProductReferenceExistsGuard,
    ],
    resolve: [
      fromResolvers.ProductReferencesResolver,
      fromResolvers.ProductReferenceExistsResolver,
    ],
    data: { corporate: true, branch: true },
  },
  {
    path: 'inventory',
    component: marketplacesContainers.ProductCoveragesComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.ProductCoveragesGuard,
      ServicesGuard,
    ],
    resolve: { coverages: fromResolvers.ProductCoveragesResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: 'inventory/new',
    component: marketplacesContainers.ProductCoverageItemComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.ProductCoveragesGuard,
      ServicesGuard,
    ],
    resolve: { coverages: fromResolvers.ProductCoveragesResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: 'inventory/:uuid',
    component: marketplacesContainers.ProductCoverageItemComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.ProductCoveragesGuard,
      fromGuards.ProductCoveragesExistsGuard,
      ServicesGuard,
    ],
    resolve: [
      fromResolvers.ProductCoveragesResolver,
      fromResolvers.ProductCoverageExistsResolver,
    ],
    data: { corporate: false, branch: false },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('marketplaces', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    ServicesModule,
    RichTextEditorModule,
  ],
  declarations: [
    ...marketplacesComponents.COMPONENTS,
    ...marketplacesContainers.COMPONENTS,
  ],
  exports: [
    ...marketplacesComponents.COMPONENTS,
    ...marketplacesContainers.COMPONENTS,
  ],
  providers: [
    ...fromFacades.facades,
    ...fromResolvers.resolvers,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
})
export class MarketplacesModule {}
