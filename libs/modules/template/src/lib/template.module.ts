import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Router
import { RouterModule, Routes } from '@angular/router';

// Jobs Components
import * as templateComponents from './components';

// Template Containers
import * as templateContainers from './containers';

// Ui
import { UiModule } from '@neural/ui';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EFFECTS, REDUCERS, facades } from './+state';

import * as fromGuards from './guards';

// CK Editor
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

// interface
import { ITemplates } from './models';

// Color picker

//Resolvers
import * as fromResolvers from './resolvers';

const ROUTES: Routes = [
  {
    path: 'master',
    children: [
      {
        path: '',
        component: templateContainers.MasterTemplatesComponent,
        canActivate: [fromGuards.MasterTemplatesGuard],
        resolve: { master: fromResolvers.MasterTemplatesResolver },
      },
      {
        path: 'new',
        component: templateContainers.MasterTemplateItemComponent,
        canActivate: [fromGuards.MasterTemplatesGuard],
        resolve: { master: fromResolvers.MasterTemplatesResolver },
        data: { tag: ITemplates.CampaignTags },
      },
      {
        path: ':uuid',
        component: templateContainers.MasterTemplateItemComponent,
        canActivate: [
          fromGuards.MasterTemplatesGuard,
          fromGuards.MasterTemplateExistsGuard,
        ],
        resolve: [
          fromResolvers.MasterTemplatesResolver,
          fromResolvers.MasterTemplateExistsResolver,
        ],
        data: { tag: ITemplates.CampaignTags },
      },
    ],
    data: {
      corporate: true,
      branch: true,
      name: ITemplates.TemplateCreationType.MASTER,
    },
  },
  {
    path: 'email',
    children: [
      {
        path: '',
        component: templateContainers.EmailTemplatesComponent,
        canActivate: [
          fromGuards.EmailTemplatesGuard,
          fromGuards.MasterTemplatesGuard,
        ],
        resolve: [
          fromResolvers.EmailTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
        ],
      },
      {
        path: 'new',
        component: templateContainers.EmailTemplateItemComponent,
        canActivate: [
          fromGuards.EmailTemplatesGuard,
          fromGuards.MasterTemplatesGuard,
        ],
        resolve: [
          fromResolvers.EmailTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
        ],
        data: {
          labels: [ITemplates.Labels.EmailNotification],
          tag: ITemplates.email,
        },
      },
      {
        path: ':uuid',
        component: templateContainers.EmailTemplateItemComponent,
        canActivate: [
          fromGuards.MasterTemplatesGuard,
          fromGuards.EmailTemplatesGuard,
          fromGuards.EmailTemplateExistsGuard,
        ],
        resolve: [
          fromResolvers.EmailTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
          fromResolvers.EmailTemplateExistsResolver,
        ],
        data: {
          labels: [ITemplates.Labels.EmailNotification],
          tag: ITemplates.email,
        },
      },
    ],
    data: { corporate: false, branch: true },
  },
  {
    path: 'inbox',
    children: [
      {
        path: '',
        component: templateContainers.InboxTemplatesComponent,
        canActivate: [
          fromGuards.InboxTemplatesGuard,
          fromGuards.MasterTemplatesGuard,
        ],
        resolve: [
          fromResolvers.InboxTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
        ],
      },
      {
        path: 'new',
        component: templateContainers.InboxTemplateItemComponent,
        canActivate: [
          fromGuards.InboxTemplatesGuard,
          fromGuards.MasterTemplatesGuard,
        ],
        resolve: [
          fromResolvers.InboxTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
        ],
        data: {
          labels: [ITemplates.Labels.InboxMessage],
          tag: ITemplates.tag,
        },
      },
      {
        path: ':uuid',
        component: templateContainers.InboxTemplateItemComponent,
        canActivate: [
          fromGuards.MasterTemplatesGuard,
          fromGuards.InboxTemplatesGuard,
          fromGuards.InboxTemplateExistsGuard,
        ],
        resolve: [
          fromResolvers.InboxTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
          fromResolvers.InboxTemplateExistsResolver,
        ],
        data: {
          labels: [ITemplates.Labels.InboxMessage],
          tag: ITemplates.tag,
        },
      },
    ],
    data: { corporate: false, branch: true },
  },
  {
    path: 'campaign',
    children: [
      {
        path: '',
        component: templateContainers.CampaignTemplatesComponent,
        canActivate: [
          fromGuards.CampaignTemplatesGuard,
          fromGuards.MasterTemplatesGuard,
        ],
        resolve: [
          fromResolvers.CampaignTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
        ],
      },
      {
        path: 'new',
        component: templateContainers.CampaignTemplateItemComponent,
        canActivate: [
          fromGuards.CampaignTemplatesGuard,
          fromGuards.MasterTemplatesGuard,
        ],
        resolve: [
          fromResolvers.CampaignTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
        ],
        data: {
          labels: [ITemplates.Labels.Campaign],
          tag: ITemplates.tag,
        },
      },
      {
        path: ':uuid',
        component: templateContainers.CampaignTemplateItemComponent,
        canActivate: [
          fromGuards.MasterTemplatesGuard,
          fromGuards.CampaignTemplatesGuard,
          fromGuards.CampaignTemplateExistsGuard,
        ],
        resolve: [
          fromResolvers.CampaignTemplatesResolver,
          fromResolvers.MasterTemplatesResolver,
          fromResolvers.CampaignTemplateExistsResolver,
        ],
        data: {
          labels: [ITemplates.Labels.Campaign],
          tag: ITemplates.tag,
        },
      },
    ],
    data: { corporate: false, branch: true },
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('templates', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
    RichTextEditorModule,
    DialogModule,
  ],
  declarations: [
    ...templateComponents.COMPONENTS,
    ...templateContainers.COMPONENTS,
  ],
  exports: [...templateComponents.COMPONENTS, ...templateContainers.COMPONENTS],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class TemplateModule {}
