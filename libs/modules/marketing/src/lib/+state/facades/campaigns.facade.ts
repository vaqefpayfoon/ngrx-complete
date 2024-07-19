import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICampaignsState } from '../reducers';
import { modelStore } from '@neural/modules/models';

// Selector
import { campaignsQuery } from '../selectors';

// Action
import { CampaignsActions } from '../actions';

// Model
import { ICampaigns } from '../../models';

@Injectable()
export class CampaignsFacade {
  loading$ = this.store.select(campaignsQuery.getCampaignsLoading);

  loaded$ = this.store.select(campaignsQuery.getCampaignsLoaded);

  error$ = this.store.select(campaignsQuery.getCampaignsError);

  campaigns$ = this.store.select(campaignsQuery.getAllCampaigns);

  campaign$ = this.store.select(campaignsQuery.getSelectedCampaign);

  campaignsConfig$ = this.store.select(campaignsQuery.getCampaignsPage);

  total$ = this.store.select(campaignsQuery.getCampaignsTotal);

  unit$ = this.store.select(modelStore.carModelsQuery.getUnit);

  images$ = this.store.select(campaignsQuery.getCampaignContentImages);

  constructor(
    private store: Store<ICampaignsState | modelStore.IModelsState>
  ) {}

  toggleStatus(campaign: ICampaigns.IDocument) {
    if (campaign.active) {
      this.store.dispatch(
        CampaignsActions.DeactivateCampaign({ payload: campaign })
      );

      this.store.dispatch(
        CampaignsActions.ResetCampaignStatus({
          payload: {
            id: campaign.uuid,
            changes: {
              isFeatured: false,
            },
          },
        })
      );
    } else {
      this.store.dispatch(
        CampaignsActions.ActivateCampaign({ payload: campaign })
      );
    }
  }

  resetToggle(campaign: ICampaigns.IDocument) {
    this.store.dispatch(
      CampaignsActions.ResetCampaignStatus({
        payload: {
          id: campaign.uuid,
          changes: {
            active: campaign.active,
          },
        },
      })
    );
  }

  changeCampaignsPage(config: ICampaigns.IConfig) {
    this.store.dispatch(CampaignsActions.SetCampaignsPage({ payload: config }));
  }

  onSelect(campaign: ICampaigns.IDocument) {
    const { uuid } = campaign;
    this.store.dispatch(CampaignsActions.GetCampaign({ payload: uuid }));
  }

  onCreate(campaign: ICampaigns.ICreate) {
    this.store.dispatch(CampaignsActions.CreateCampaign({ payload: campaign }));
  }

  onUpdate(campaign: ICampaigns.IDocument) {
    this.store.dispatch(CampaignsActions.UpdateCampaign({ payload: campaign }));
  }

  onResetSelectedCampaign() {
    this.store.dispatch(CampaignsActions.ResetSelectedCampaign());
  }

  onRedirect() {
    this.store.dispatch(CampaignsActions.RedirectToCampaigns());
  }

  getBrandsAndSeries() {
    this.store.dispatch(modelStore.CarModelsActions.GetBrandsAndSeries());
  }

  getSeriesModels(payload: { brand: string; series: string }) {
    this.store.dispatch(modelStore.CarModelsActions.GetSeriesModels(payload));
  }

  onSendCampaignPushNotification(payload: ICampaigns.IDocument) {
    this.store.dispatch(
      CampaignsActions.SendCampaignPushNotification({ payload })
    );
  }

  uploadCampaignImage(payload: File): void {
    this.store.dispatch(
      CampaignsActions.UploadCampaignContentImage({ payload })
    );
  }

  getVariants(payload: {
    corporateUuid: string;
    brand: string;
    series: string;
    model: string;
  }) {
    this.store.dispatch(modelStore.CarModelsActions.GetVariants({ payload }));
  }

  getCampaign(uuid: string) {
    this.store.dispatch(CampaignsActions.GetCampaign({ payload: uuid }));
  }

  toggleFeature(campaign: ICampaigns.IDocument) {
    if (campaign.isFeatured) {
      this.store.dispatch(
        CampaignsActions.OffFeatureCampaign({ payload: campaign })
      );
    } else {
      this.store.dispatch(
        CampaignsActions.OnFeatureCampaign({ payload: campaign })
      );
    }
  }

  resetFeature(campaign: ICampaigns.IDocument) {
    this.store.dispatch(
      CampaignsActions.ResetCampaignStatus({
        payload: {
          id: campaign.uuid,
          changes: {
            isFeatured: campaign.isFeatured,
          },
        },
      })
    );
  }
}
