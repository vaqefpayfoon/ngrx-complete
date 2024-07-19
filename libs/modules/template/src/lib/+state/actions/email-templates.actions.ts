import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Templates
import { ITemplates } from '../../models';
import { IError } from '@neural/shared/data';

// Set Templates Page
export const SetEmailTemplatesPage = createAction(
  '[Configuration] Set Email Templates Page',
  props<{
    payload: {
      config: ITemplates.IConfig;
      filters?: ITemplates.IFilter[];
    };
  }>()
);

// Load Templates
export const LoadEmailTemplates = createAction(
  '[Configuration] Load Email Templates'
);
export const LoadEmailTemplatesFail = createAction(
  '[Configuration] Load Email Templates Fail',
  props<{ payload: IError }>()
);
export const LoadEmailTemplatesSuccess = createAction(
  '[Configuration] Load Email Templates Success',
  props<{
    templates: ITemplates.IDocument[];
    pagination: ITemplates.IPagination;
  }>()
);

// Activate Templates
export const ActivateEmailTemplate = createAction(
  '[Configuration] Activate Email Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const ActivateEmailTemplateFail = createAction(
  '[Configuration] Activate Email Template Fail',
  props<{ payload: IError }>()
);
export const ActivateEmailTemplatesSuccess = createAction(
  '[Configuration] Activate Email Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Deactivate Templates
export const DeactivateEmailTemplate = createAction(
  '[Configuration] Deactivate Email Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeactivateEmailTemplateFail = createAction(
  '[Configuration] Deactivate Email Template Fail',
  props<{ payload: IError }>()
);
export const DeactivateEmailTemplateSuccess = createAction(
  '[Configuration] Deactivate Email Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Reset Template Status
export const ResetEmailTemplateStatus = createAction(
  '[Configuration] Reset Email Template Status',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Get Template
export const GetEmailTemplate = createAction(
  '[Configuration] Get Email Template',
  props<{ payload: string }>()
);
export const GetEmailTemplateFail = createAction(
  '[Configuration] Get Email Template Fail',
  props<{ payload: IError }>()
);
export const GetEmailTemplateSuccess = createAction(
  '[Configuration] Get Email Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Create Template
export const CreateEmailTemplate = createAction(
  '[Configuration] Create Email Template',
  props<{ payload: ITemplates.ICreate }>()
);
export const CreateEmailTemplateFail = createAction(
  '[Configuration] Create Email Template Fail',
  props<{ payload: IError }>()
);
export const CreateEmailTemplateSuccess = createAction(
  '[Configuration] Create Email Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Create Template
export const CreateEmailFromMasterTemplate = createAction(
  '[Configuration] Create Email From Master Template',
  props<{ payload: ITemplates.ICreateFromMaster }>()
);
export const CreateEmailFromMasterTemplateFail = createAction(
  '[Configuration] Create Email From Master Template Fail',
  props<{ payload: IError }>()
);
export const CreateEmailFromMasterTemplateSuccess = createAction(
  '[Configuration] Create Email From Master Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Update Template
export const UpdateEmailTemplate = createAction(
  '[Configuration] Update Email Template',
  props<{ payload: ITemplates.IUpdate }>()
);
export const UpdateEmailTemplateFail = createAction(
  '[Configuration] Update Email Template Fail',
  props<{ payload: IError }>()
);
export const UpdateEmailTemplateSuccess = createAction(
  '[Configuration] Update Email Template Success',
  props<{ payload: Update<ITemplates.IUpdate> }>()
);

// Delete Template
export const DeletetEmailTemplate = createAction(
  '[Configuration] Delete Email Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeletetEmailTemplateFail = createAction(
  '[Configuration] Delete Email Template Fail',
  props<{ payload: IError }>()
);
export const DeletetEmailTemplateSuccess = createAction(
  '[Configuration] Delete Email Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Upload Email Template Image
export const UploadEmailTemplateImage = createAction(
  '[Configuration] Upload Email Template Image',
  props<{ payload: File }>()
);
export const UploadEmailTemplateImageFail = createAction(
  '[Configuration] Upload Email Template Image Fail',
  props<{ payload: IError }>()
);
export const UploadEmailTemplateImageSuccess = createAction(
  '[Configuration] Upload Email Template Image Success',
  props<{ payload: string }>()
);

// redirect
export const RedirectToEmailTemplates = createAction(
  '[Configuration] Redirect To Email Templates'
);

// Reset Selected Email Template
export const ResetSelectedEmailTemplate = createAction(
  '[Configuration] Reset Selected Email Template'
);

const all = union({
  SetEmailTemplatesPage,
  LoadEmailTemplates,
  LoadEmailTemplatesFail,
  LoadEmailTemplatesSuccess,
  ActivateEmailTemplate,
  ActivateEmailTemplateFail,
  ActivateEmailTemplatesSuccess,
  DeactivateEmailTemplate,
  DeactivateEmailTemplateFail,
  DeactivateEmailTemplateSuccess,
  ResetEmailTemplateStatus,
  GetEmailTemplate,
  GetEmailTemplateFail,
  GetEmailTemplateSuccess,
  CreateEmailTemplate,
  CreateEmailTemplateFail,
  CreateEmailTemplateSuccess,
  CreateEmailFromMasterTemplate,
  CreateEmailFromMasterTemplateFail,
  CreateEmailFromMasterTemplateSuccess,
  UpdateEmailTemplate,
  UpdateEmailTemplateFail,
  UpdateEmailTemplateSuccess,
  DeletetEmailTemplate,
  DeletetEmailTemplateFail,
  DeletetEmailTemplateSuccess,
  UploadEmailTemplateImage,
  UploadEmailTemplateImageFail,
  UploadEmailTemplateImageSuccess,
  RedirectToEmailTemplates,
  ResetSelectedEmailTemplate
});
export type EmailTemplatesActionsUnion = typeof all;
