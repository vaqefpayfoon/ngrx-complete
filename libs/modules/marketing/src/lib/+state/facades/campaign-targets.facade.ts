import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICampaignsState } from '../reducers';

// Selector
import { campaignTargetsQuery } from '../selectors';

// Action
import { CampaignTargetsActions } from '../actions';

// Model
import { ICampaignTargets } from '../../models';

@Injectable()
export class CampaignTargetsFacade {
  loading$ = this.store.select(campaignTargetsQuery.getCampaignTargetsLoading);

  error$ = this.store.select(campaignTargetsQuery.getCampaignTargetsError);

  campaignTargets$ = this.store.select(
    campaignTargetsQuery.getAllCampaignTargets
  );

  campaignsConfig$ = this.store.select(
    campaignTargetsQuery.getCampaignTargetsConfig
  );

  campaignsFilter$ = this.store.select(
    campaignTargetsQuery.getCampaignTargetsFilter
  );

  total$ = this.store.select(campaignTargetsQuery.getCampaignTargetsTotal);

  constructor(private store: Store<ICampaignsState>) {}

  /**
   * @description set capmaign filter and config
   * @author {{Mohammad Jalili}}
   * @param {ICampaignTargets.IConfig} config
   * @param {ICampaignTargets.IFilter[]} [filters]
   * @memberof CampaignTargetsFacade
   */
  setCampaignTargetsPage(
    config: ICampaignTargets.IConfig,
    filters: ICampaignTargets.IFilter[]
  ) {
    this.store.dispatch(
      CampaignTargetsActions.SetCampaignTargetsPage({
        payload: { ...filters, config },
      })
    );
  }
}
