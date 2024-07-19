import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Angular Router
import { RouterModule, Routes } from '@angular/router';

// Jobs Components
import * as marketingComponents from './components';

// Jobs Containers
import * as marketingContainers from './containers';

// Auth Guard
import * as fromAuth from '@neural/auth';

// Ui
import { UiModule } from '@neural/ui';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';

// CK Editor
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';

//Resolvers
import * as fromResolvers from './resolvers';

import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';

// Models Module
import { ModelsModule } from '@neural/modules/models';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';

const ROUTES: Routes = [
  {
    path: 'campaigns',
    component: marketingContainers.CampaignsComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.CampaignsGuard],
    resolve: { campaigns: fromResolvers.CampaignsResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'campaigns/new',
    component: marketingContainers.CampaignItemComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.CampaignsGuard],
    resolve: { campaigns: fromResolvers.CampaignsResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'campaigns/:uuid',
    component: marketingContainers.CampaignItemComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.CampaignsGuard,
      fromGuards.CampaignExistsGuard,
    ],
    resolve: [
      fromResolvers.CampaignsResolver,
      fromResolvers.CampaignExistsResolver,
    ],
    data: { corporate: false, branch: true },
  },
  {
    path: 'inbox-messages',
    component: marketingContainers.InboxMessagesComponent,
    canActivate: [fromAuth.AuthGuard, fromGuards.InboxMessagesGuard],
    resolve: { inbox: fromResolvers.InboxMessagesResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'inbox-messages/new',
    component: marketingContainers.InboxMessageItemComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.InboxMessagesGuard,
      fromAuth.CallingCodesExistsGuard,
    ],
    resolve: { inbox: fromResolvers.InboxMessagesResolver },
    data: { corporate: false, branch: true },
  },
  {
    path: 'inbox-messages/:uuid',
    component: marketingContainers.InboxMessageAdhocComponent,
    canActivate: [
      fromAuth.AuthGuard,
      fromGuards.InboxMessageExistsGuard,
      fromAuth.CallingCodesExistsGuard,
    ],
    resolve: { inboxExists: fromResolvers.InboxMessageExistsResolver },
    data: { corporate: false, branch: true },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('marketing', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    RichTextEditorModule,
    ModelsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
  ],
  declarations: [
    ...marketingComponents.COMPONENTS,
    ...marketingContainers.COMPONENTS,
  ],
  exports: [
    ...marketingComponents.COMPONENTS,
    ...marketingContainers.COMPONENTS,
  ],
  providers: [
    ...facades,
    ...fromResolvers.resolvers,
    DatePipe,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
})
export class MarketingModule {}
