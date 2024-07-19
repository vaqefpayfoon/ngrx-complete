import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { ICampaigns } from '../../models';
import { IError } from '@neural/shared/data';

// Set Campaigns Page
export const SetCampaignsPage = createAction(
  '[Admin] Set Campaigns Page',
  props<{ payload: ICampaigns.IConfig }>()
);

// Load Campaigns
export const LoadCampaigns = createAction('[Admin] Load Campaigns');
export const LoadCampaignsFail = createAction(
  '[Admin] Load Campaigns Fail',
  props<{ payload: IError }>()
);
export const LoadCampaignsSuccess = createAction(
  '[Admin] Load Campaigns Success',
  props<{
    campaigns: ICampaigns.IDocument[];
    pagination: ICampaigns.IPagination;
  }>()
);

// Create Campaigns
export const CreateCampaign = createAction(
  '[Admin] Create Campaign',
  props<{ payload: ICampaigns.ICreate }>()
);
export const CreateCampaignFail = createAction(
  '[Admin] Create Campaign Fail',
  props<{ payload: IError }>()
);
export const CreateCampaignSuccess = createAction(
  '[Admin] Create Campaign Success',
  props<{ payload: ICampaigns.IDocument }>()
);

// Update Campaign
export const UpdateCampaign = createAction(
  '[Admin] Update Campaign',
  props<{ payload: ICampaigns.IDocument }>()
);
export const UpdateCampaignFail = createAction(
  '[Admin] Update Campaign Fail',
  props<{ payload: IError }>()
);
export const UpdateCampaignSuccess = createAction(
  '[Admin] Update Campaign Success',
  props<{ payload: Update<ICampaigns.IDocument> }>()
);

// Activate Campaigns
export const ActivateCampaign = createAction(
  '[Admin] Activate Campaign',
  props<{ payload: ICampaigns.IDocument }>()
);
export const ActivateCampaignFail = createAction(
  '[Admin] Activate Campaign Fail',
  props<{ payload: IError }>()
);
export const ActivateCampaignsSuccess = createAction(
  '[Admin] Activate Campaign Success',
  props<{ payload: Update<ICampaigns.IDocument> }>()
);

// Deactivate Campaigns
export const DeactivateCampaign = createAction(
  '[Admin] Deactivate Campaign',
  props<{ payload: ICampaigns.IDocument }>()
);
export const DeactivateCampaignFail = createAction(
  '[Admin] Deactivate Campaign Fail',
  props<{ payload: IError }>()
);
export const DeactivateCampaignSuccess = createAction(
  '[Admin] Deactivate Campaign Success',
  props<{ payload: Update<ICampaigns.IDocument> }>()
);

// Get Campaign
export const GetCampaign = createAction(
  '[Admin] Get Campaign',
  props<{ payload: string }>()
);
export const GetCampaignFail = createAction(
  '[Admin] Get Campaign Fail',
  props<{ payload: IError }>()
);
export const GetCampaignSuccess = createAction(
  '[Admin] Get Campaign Success',
  props<{ payload: ICampaigns.IDocument }>()
);

// Send Campaign Push Notification
export const SendCampaignPushNotification = createAction(
  '[Admin] Send Campaign Push Notification',
  props<{ payload: ICampaigns.IDocument }>()
);
export const SendCampaignPushNotificationFail = createAction(
  '[Admin] Send Campaign Push Notification Fail',
  props<{ payload: IError }>()
);
export const SendCampaignPushNotificationSuccess = createAction(
  '[Admin] Send Campaign Push Notification Success',
  props<{ payload: string }>()
);

// Reset Campaign Status
export const ResetCampaignStatus = createAction(
  '[Admin] Reset Campaign Status',
  props<{ payload: Update<ICampaigns.IDocument> }>()
);

// Reset Selected campiagn
export const ResetSelectedCampaign = createAction(
  '[Admin] Reset Selected Campaign'
);

// redirect
export const RedirectToCampaigns = createAction(
  '[Configuration] Redirect To Campaigns'
);

// Upload Campaign Content Image
export const UploadCampaignContentImage = createAction(
  '[Admin] Upload Campaign Content Image',
  props<{ payload: File }>()
);
export const UploadCampaignContentImageFail = createAction(
  '[Admin] Upload Campaign Content Image Fail',
  props<{ payload: IError }>()
);
export const UploadCampaignContentImageSuccess = createAction(
  '[Admin] Upload Campaign Content Image Success',
  props<{ payload: string }>()
);


// on Feature Campaigns
export const OnFeatureCampaign = createAction(
  '[Admin] On Feature Campaign',
  props<{ payload: ICampaigns.IDocument }>()
);
export const OnFeatureCampaignFail = createAction(
  '[Admin] On Feature Campaign Fail',
  props<{ payload: IError }>()
);
export const OnFeatureCampaignsSuccess = createAction(
  '[Admin] On Feature Campaign Success',
  props<{ payload: Update<ICampaigns.IDocument> }>()
);

// off Feature Campaigns
export const OffFeatureCampaign = createAction(
  '[Admin] Off Feature Campaign',
  props<{ payload: ICampaigns.IDocument }>()
);
export const OffFeatureCampaignFail = createAction(
  '[Admin] Off Feature Campaign Fail',
  props<{ payload: IError }>()
);
export const OffFeatureCampaignSuccess = createAction(
  '[Admin] Off Feature Campaign Success',
  props<{ payload: Update<ICampaigns.IDocument> }>()
);

const all = union({
  SetCampaignsPage,
  LoadCampaigns,
  LoadCampaignsFail,
  LoadCampaignsSuccess,
  CreateCampaign,
  CreateCampaignFail,
  CreateCampaignSuccess,
  UpdateCampaign,
  UpdateCampaignFail,
  UpdateCampaignSuccess,
  ActivateCampaign,
  ActivateCampaignFail,
  ActivateCampaignsSuccess,
  DeactivateCampaign,
  DeactivateCampaignFail,
  DeactivateCampaignSuccess,
  GetCampaign,
  GetCampaignFail,
  GetCampaignSuccess,
  ResetCampaignStatus,
  ResetSelectedCampaign,
  SendCampaignPushNotification,
  SendCampaignPushNotificationFail,
  SendCampaignPushNotificationSuccess,
  RedirectToCampaigns,
  UploadCampaignContentImage,
  UploadCampaignContentImageFail,
  UploadCampaignContentImageSuccess,
  OnFeatureCampaign,
  OnFeatureCampaignsSuccess,
  OnFeatureCampaignFail,
  OffFeatureCampaign,
  OffFeatureCampaignSuccess,
  OffFeatureCampaignFail,
});
export type CampaignsActionsUnion = typeof all;
