import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ITemplatesState } from '../reducers';
import * as fromRoot from '@neural/ngrx-router';

// Selector
import { campaignTemplatesQuery } from '../selectors';

// Action
import { CampaignTemplatesActions } from '../actions';

// Model
import { ITemplates } from '../../models';

@Injectable()
export class CampaignTemplatesFacade {
  loading$ = this.store.select(
    campaignTemplatesQuery.getCampaignTemplatesLoading
  );

  loaded$ = this.store.select(
    campaignTemplatesQuery.getCampaignTemplatesLoaded
  );

  error$ = this.store.select(campaignTemplatesQuery.getCampaignTemplatesError);

  templates$ = this.store.select(
    campaignTemplatesQuery.getCampaignAllTemplates
  );

  template$ = this.store.select(
    campaignTemplatesQuery.getCampaignSelectedTemplate
  );

  templatesConfig$ = this.store.select(
    campaignTemplatesQuery.getCampaignTemplatesPage
  );

  templatesFilter$ = this.store.select(
    campaignTemplatesQuery.getCampaignTemplatesFilter
  );

  total$ = this.store.select(campaignTemplatesQuery.getCampaignTemplatesTotal);

  router$ = this.store.select(fromRoot.getRouterState);

  images$ = this.store.select(campaignTemplatesQuery.getCampaignTemplateImages);

  constructor(private store: Store<ITemplatesState>) {}

  changeCampaignTemplatesPage(
    config: ITemplates.IConfig,
    filters?: ITemplates.IFilter[]
  ) {
    this.store.dispatch(
      CampaignTemplatesActions.SetCampaignTemplatesPage({
        payload: { filters, config },
      })
    );
  }

  toggleStatus(template: ITemplates.IDocument) {
    if (template.active) {
      this.store.dispatch(
        CampaignTemplatesActions.DeactivateCampaignTemplate({
          payload: template,
        })
      );
    } else {
      this.store.dispatch(
        CampaignTemplatesActions.ActivateCampaignTemplate({ payload: template })
      );
    }
  }

  resetToggle(template: ITemplates.IDocument) {
    this.store.dispatch(
      CampaignTemplatesActions.ResetCampaignTemplateStatus({
        payload: {
          id: template.uuid,
          changes: {
            active: template.active,
          },
        },
      })
    );
  }

  onResetSelectedCampaignTemplate() {
    this.store.dispatch(
      CampaignTemplatesActions.ResetSelectedCampaignTemplate()
    );
  }

  onCreate(payload: ITemplates.ICreate) {
    this.store.dispatch(
      CampaignTemplatesActions.CreateCampaignTemplate({ payload })
    );
  }

  onCreateFromMaster(payload: ITemplates.ICreateFromMaster) {
    this.store.dispatch(
      CampaignTemplatesActions.CreateCampaignFromMasterTemplate({ payload })
    );
  }

  onUpdate(payload: ITemplates.IUpdate) {
    this.store.dispatch(
      CampaignTemplatesActions.UpdateCampaignTemplate({ payload })
    );
  }

  onDelete(payload: ITemplates.IDocument) {
    this.store.dispatch(
      CampaignTemplatesActions.DeletetCampaignTemplate({ payload })
    );
  }

  onRedirect() {
    this.store.dispatch(CampaignTemplatesActions.RedirectToCampaignTemplates());
  }

  uploadTemplateImage(payload: File): void {
    this.store.dispatch(
      CampaignTemplatesActions.UploadCampaignTemplateImage({ payload })
    );
  }

  getCampaignTemplate(uuid: string) {
    this.store.dispatch(
      CampaignTemplatesActions.GetCampaignTemplate({ payload: uuid })
    );
  }
}
