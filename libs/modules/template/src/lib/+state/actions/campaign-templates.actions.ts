import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Templates
import { ITemplates } from '../../models';
import { IError } from '@neural/shared/data';

// Set Templates Page
export const SetCampaignTemplatesPage = createAction(
  '[Configuration] Set Campaign Templates Page',
  props<{
    payload: {
      config: ITemplates.IConfig;
      filters?: ITemplates.IFilter[];
    };
  }>()
);

// Load Templates
export const LoadCampaignTemplates = createAction(
  '[Configuration] Load Campaign Templates'
);
export const LoadCampaignTemplatesFail = createAction(
  '[Configuration] Load Campaign Templates Fail',
  props<{ payload: IError }>()
);
export const LoadCampaignTemplatesSuccess = createAction(
  '[Configuration] Load Campaign Templates Success',
  props<{
    templates: ITemplates.IDocument[];
    pagination: ITemplates.IPagination;
  }>()
);

// Activate Templates
export const ActivateCampaignTemplate = createAction(
  '[Configuration] Activate Campaign Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const ActivateCampaignTemplateFail = createAction(
  '[Configuration] Activate Campaign Template Fail',
  props<{ payload: IError }>()
);
export const ActivateCampaignTemplatesSuccess = createAction(
  '[Configuration] Activate Campaign Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Deactivate Templates
export const DeactivateCampaignTemplate = createAction(
  '[Configuration] Deactivate Campaign Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeactivateCampaignTemplateFail = createAction(
  '[Configuration] Deactivate Campaign Template Fail',
  props<{ payload: IError }>()
);
export const DeactivateCampaignTemplateSuccess = createAction(
  '[Configuration] Deactivate Campaign Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Reset Template Status
export const ResetCampaignTemplateStatus = createAction(
  '[Configuration] Reset Campaign Template Status',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Get Template
export const GetCampaignTemplate = createAction(
  '[Configuration] Get Campaign Template',
  props<{ payload: string }>()
);
export const GetCampaignTemplateFail = createAction(
  '[Configuration] Get Campaign Template Fail',
  props<{ payload: IError }>()
);
export const GetCampaignTemplateSuccess = createAction(
  '[Configuration] Get Campaign Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Create Template
export const CreateCampaignTemplate = createAction(
  '[Configuration] Create Campaign Template',
  props<{ payload: ITemplates.ICreate }>()
);
export const CreateCampaignTemplateFail = createAction(
  '[Configuration] Create Campaign Template Fail',
  props<{ payload: IError }>()
);
export const CreateCampaignTemplateSuccess = createAction(
  '[Configuration] Create Campaign Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Create Template
export const CreateCampaignFromMasterTemplate = createAction(
  '[Configuration] Create Campaign From Master Template',
  props<{ payload: ITemplates.ICreateFromMaster }>()
);
export const CreateCampaignFromMasterTemplateFail = createAction(
  '[Configuration] Create Campaign From Master Template Fail',
  props<{ payload: IError }>()
);
export const CreateCampaignFromMasterTemplateSuccess = createAction(
  '[Configuration] Create Campaign From Master Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Update Template
export const UpdateCampaignTemplate = createAction(
  '[Configuration] Update Campaign Template',
  props<{ payload: ITemplates.IUpdate }>()
);
export const UpdateCampaignTemplateFail = createAction(
  '[Configuration] Update Campaign Template Fail',
  props<{ payload: IError }>()
);
export const UpdateCampaignTemplateSuccess = createAction(
  '[Configuration] Update Campaign Template Success',
  props<{ payload: Update<ITemplates.IUpdate> }>()
);

// Delete Template
export const DeletetCampaignTemplate = createAction(
  '[Configuration] Delete Campaign Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeletetCampaignTemplateFail = createAction(
  '[Configuration] Delete Campaign Template Fail',
  props<{ payload: IError }>()
);
export const DeletetCampaignTemplateSuccess = createAction(
  '[Configuration] Delete Campaign Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Upload Campaign Template Image
export const UploadCampaignTemplateImage = createAction(
  '[Configuration] Upload Campaign Template Image',
  props<{ payload: File }>()
);
export const UploadCampaignTemplateImageFail = createAction(
  '[Configuration] Upload Campaign Template Image Fail',
  props<{ payload: IError }>()
);
export const UploadCampaignTemplateImageSuccess = createAction(
  '[Configuration] Upload Campaign Template Image Success',
  props<{ payload: string }>()
);

// redirect
export const RedirectToCampaignTemplates = createAction(
  '[Configuration] Redirect To Campaign Templates'
);

// Reset Selected Campaign Template
export const ResetSelectedCampaignTemplate = createAction(
  '[Admin] Reset Selected Campaign Template'
);

const all = union({
  SetCampaignTemplatesPage,
  LoadCampaignTemplates,
  LoadCampaignTemplatesFail,
  LoadCampaignTemplatesSuccess,
  ActivateCampaignTemplate,
  ActivateCampaignTemplateFail,
  ActivateCampaignTemplatesSuccess,
  DeactivateCampaignTemplate,
  DeactivateCampaignTemplateFail,
  DeactivateCampaignTemplateSuccess,
  ResetCampaignTemplateStatus,
  GetCampaignTemplate,
  GetCampaignTemplateFail,
  GetCampaignTemplateSuccess,
  CreateCampaignTemplate,
  CreateCampaignTemplateFail,
  CreateCampaignTemplateSuccess,
  CreateCampaignFromMasterTemplate,
  CreateCampaignFromMasterTemplateFail,
  CreateCampaignFromMasterTemplateSuccess,
  UpdateCampaignTemplate,
  UpdateCampaignTemplateFail,
  UpdateCampaignTemplateSuccess,
  DeletetCampaignTemplate,
  DeletetCampaignTemplateFail,
  DeletetCampaignTemplateSuccess,
  UploadCampaignTemplateImage,
  UploadCampaignTemplateImageFail,
  UploadCampaignTemplateImageSuccess,
  RedirectToCampaignTemplates,
  ResetSelectedCampaignTemplate
});
export type CampaignTemplatesActionsUnion = typeof all;
