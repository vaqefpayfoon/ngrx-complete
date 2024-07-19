import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Corporates Components
import * as servicesComponents from './components';

// Corporates Containers
import * as servicesContainers from './containers';

// Ui
import { UiModule } from '@neural/ui';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

// Guards
import * as fromGuards from './guards';

//Resolvers
import * as fromResolvers from './resolvers';

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
    path: 'list',
    component: servicesContainers.ServicesComponent,
    canActivate: [fromGuards.ServicesGuard],
    resolve: { services: fromResolvers.ServicesResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: 'action/new',
    component: servicesContainers.ServiceItemComponent,
    canActivate: [fromGuards.ServicesGuard],
    resolve: { services: fromResolvers.ServicesResolver },
    data: { corporate: false, branch: false },
  },
  {
    path: 'action/:uuid',
    component: servicesContainers.ServiceItemComponent,
    canActivate: [fromGuards.ServicesGuard, fromGuards.ServiceExistsGuard],
    resolve: [
      fromResolvers.ServicesResolver,
      fromResolvers.ServiceExistsResolver,
    ],
    data: { corporate: false, branch: false },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('service', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    RichTextEditorModule,
  ],
  declarations: [
    ...servicesComponents.COMPONENTS,
    ...servicesContainers.COMPONENTS,
  ],
  exports: [...servicesComponents.COMPONENTS, ...servicesContainers.COMPONENTS],
  providers: [
    ...facades,
    ...fromResolvers.resolvers,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
})
export class ServicesModule {}
