import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { ICampaignTargets } from '../../models';
import { IError } from '@neural/shared/data';

// Set Campaign Targets Page
export const SetCampaignTargetsPage = createAction(
  '[Admin] Set Campaign Targets Page',
  props<{
    payload: {
      config: ICampaignTargets.IConfig;
      filters?: ICampaignTargets.IFilter[];
    };
  }>()
);

// Load Campaign Targets
export const LoadCampaignTargets = createAction(
  '[Admin] Load Campaign Targets'
);
export const LoadCampaignTargetsFail = createAction(
  '[Admin] Load Campaign Targets Fail',
  props<{ payload: IError }>()
);
export const LoadCampaignTargetsSuccess = createAction(
  '[Admin] Load Campaign Targets Success',
  props<{
    campaignTargets: ICampaignTargets.IDocument[];
    pagination: ICampaignTargets.IPagination;
  }>()
);

const all = union({
  SetCampaignTargetsPage,
  LoadCampaignTargets,
  LoadCampaignTargetsFail,
  LoadCampaignTargetsSuccess
});
export type CampaignTargetActionsUnion = typeof all;
