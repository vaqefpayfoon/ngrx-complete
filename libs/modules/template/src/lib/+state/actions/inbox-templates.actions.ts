import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Templates
import { ITemplates } from '../../models';
import { IError } from '@neural/shared/data';

// Set Templates Page
export const SetInboxTemplatesPage = createAction(
  '[Configuration] Set Inbox Templates Page',
  props<{
    payload: {
      config: ITemplates.IConfig;
      filters?: ITemplates.IFilter[];
    };
  }>()
);

// Load Templates
export const LoadInboxTemplates = createAction(
  '[Configuration] Load Inbox Templates'
);
export const LoadInboxTemplatesFail = createAction(
  '[Configuration] Load Inbox Templates Fail',
  props<{ payload: IError }>()
);
export const LoadInboxTemplatesSuccess = createAction(
  '[Configuration] Load Inbox Templates Success',
  props<{
    templates: ITemplates.IDocument[];
    pagination: ITemplates.IPagination;
  }>()
);

// Activate Templates
export const ActivateInboxTemplate = createAction(
  '[Configuration] Activate Inbox Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const ActivateInboxTemplateFail = createAction(
  '[Configuration] Activate Inbox Template Fail',
  props<{ payload: IError }>()
);
export const ActivateInboxTemplatesSuccess = createAction(
  '[Configuration] Activate Inbox Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Deactivate Templates
export const DeactivateInboxTemplate = createAction(
  '[Configuration] Deactivate Inbox Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeactivateInboxTemplateFail = createAction(
  '[Configuration] Deactivate Inbox Template Fail',
  props<{ payload: IError }>()
);
export const DeactivateInboxTemplateSuccess = createAction(
  '[Configuration] Deactivate Inbox Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Reset Template Status
export const ResetInboxTemplateStatus = createAction(
  '[Configuration] Reset Inbox Template Status',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Get Template
export const GetInboxTemplate = createAction(
  '[Configuration] Get Inbox Template',
  props<{ payload: string }>()
);
export const GetInboxTemplateFail = createAction(
  '[Configuration] Get Inbox Template Fail',
  props<{ payload: IError }>()
);
export const GetInboxTemplateSuccess = createAction(
  '[Configuration] Get Inbox Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Create Template
export const CreateInboxTemplate = createAction(
  '[Configuration] Create Inbox Template',
  props<{ payload: ITemplates.ICreate }>()
);
export const CreateInboxTemplateFail = createAction(
  '[Configuration] Create Inbox Template Fail',
  props<{ payload: IError }>()
);
export const CreateInboxTemplateSuccess = createAction(
  '[Configuration] Create Inbox Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Create Template
export const CreateInboxFromMasterTemplate = createAction(
  '[Configuration] Create Inbox From Master Template',
  props<{ payload: ITemplates.ICreateFromMaster }>()
);
export const CreateInboxFromMasterTemplateFail = createAction(
  '[Configuration] Create Inbox From Master Template Fail',
  props<{ payload: IError }>()
);
export const CreateInboxFromMasterTemplateSuccess = createAction(
  '[Configuration] Create Inbox From Master Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Update Template
export const UpdateInboxTemplate = createAction(
  '[Configuration] Update Inbox Template',
  props<{ payload: ITemplates.IUpdate }>()
);
export const UpdateInboxTemplateFail = createAction(
  '[Configuration] Update Inbox Template Fail',
  props<{ payload: IError }>()
);
export const UpdateInboxTemplateSuccess = createAction(
  '[Configuration] Update Inbox Template Success',
  props<{ payload: Update<ITemplates.IUpdate> }>()
);

// Delete Template
export const DeletetInboxTemplate = createAction(
  '[Configuration] Delete Inbox Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeletetInboxTemplateFail = createAction(
  '[Configuration] Delete Inbox Template Fail',
  props<{ payload: IError }>()
);
export const DeletetInboxTemplateSuccess = createAction(
  '[Configuration] Delete Inbox Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Upload Inbox Template Image
export const UploadInboxTemplateImage = createAction(
  '[Configuration] Upload Inbox Template Image',
  props<{ payload: File }>()
);
export const UploadInboxTemplateImageFail = createAction(
  '[Configuration] Upload Inbox Template Image Fail',
  props<{ payload: IError }>()
);
export const UploadInboxTemplateImageSuccess = createAction(
  '[Configuration] Upload Inbox Template Image Success',
  props<{ payload: string }>()
);

// redirect
export const RedirectToInboxTemplates = createAction(
  '[Configuration] Redirect To Inbox Templates'
);

// Reset Selected Inbox Template
export const ResetSelectedInboxTemplate = createAction(
  '[Configuration] Reset Selected Inbox Template'
);

const all = union({
  SetInboxTemplatesPage,
  LoadInboxTemplates,
  LoadInboxTemplatesFail,
  LoadInboxTemplatesSuccess,
  ActivateInboxTemplate,
  ActivateInboxTemplateFail,
  ActivateInboxTemplatesSuccess,
  DeactivateInboxTemplate,
  DeactivateInboxTemplateFail,
  DeactivateInboxTemplateSuccess,
  ResetInboxTemplateStatus,
  GetInboxTemplate,
  GetInboxTemplateFail,
  GetInboxTemplateSuccess,
  CreateInboxTemplate,
  CreateInboxTemplateFail,
  CreateInboxTemplateSuccess,
  CreateInboxFromMasterTemplate,
  CreateInboxFromMasterTemplateFail,
  CreateInboxFromMasterTemplateSuccess,
  UpdateInboxTemplate,
  UpdateInboxTemplateFail,
  UpdateInboxTemplateSuccess,
  DeletetInboxTemplate,
  DeletetInboxTemplateFail,
  DeletetInboxTemplateSuccess,
  UploadInboxTemplateImage,
  UploadInboxTemplateImageFail,
  UploadInboxTemplateImageSuccess,
  RedirectToInboxTemplates,
  ResetSelectedInboxTemplate
});
export type InboxTemplatesActionsUnion = typeof all;
