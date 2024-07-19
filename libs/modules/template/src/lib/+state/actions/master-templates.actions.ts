import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Templates
import { ITemplates } from '../../models';
import { IError } from '@neural/shared/data';

// Set Templates Page
export const SetMasterTemplatesPage = createAction(
  '[Configuration] Set Master Templates Page',
  props<{
    payload: {
      config: ITemplates.IConfig;
      filters?: ITemplates.IFilter[];
    };
  }>()
);

// Load Templates
export const LoadMasterTemplates = createAction(
  '[Configuration] Load Master Templates'
);
export const LoadMasterTemplatesFail = createAction(
  '[Configuration] Load Master Templates Fail',
  props<{ payload: IError }>()
);
export const LoadMasterTemplatesSuccess = createAction(
  '[Configuration] Load Master Templates Success',
  props<{
    templates: ITemplates.IDocument[];
    pagination: ITemplates.IPagination;
  }>()
);

// Activate Templates
export const ActivateMasterTemplate = createAction(
  '[Configuration] Activate Master Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const ActivateMasterTemplateFail = createAction(
  '[Configuration] Activate Master Template Fail',
  props<{ payload: IError }>()
);
export const ActivateMasterTemplatesSuccess = createAction(
  '[Configuration] Activate Master Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Deactivate Templates
export const DeactivateMasterTemplate = createAction(
  '[Configuration] Deactivate Master Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeactivateMasterTemplateFail = createAction(
  '[Configuration] Deactivate Master Template Fail',
  props<{ payload: IError }>()
);
export const DeactivateMasterTemplateSuccess = createAction(
  '[Configuration] Deactivate Master Template Success',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Reset Template Status
export const ResetMasterTemplateStatus = createAction(
  '[Configuration] Reset Master Template Status',
  props<{ payload: Update<ITemplates.IDocument> }>()
);

// Get Template
export const GetMasterTemplate = createAction(
  '[Configuration] Get Master Template',
  props<{ payload: string }>()
);
export const GetMasterTemplateFail = createAction(
  '[Configuration] Get Master Template Fail',
  props<{ payload: IError }>()
);
export const GetMasterTemplateSuccess = createAction(
  '[Configuration] Get Master Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Create Template
export const CreateMasterTemplate = createAction(
  '[Configuration] Create Master Template',
  props<{ payload: ITemplates.ICreateMaster }>()
);
export const CreateMasterTemplateFail = createAction(
  '[Configuration] Create Master Template Fail',
  props<{ payload: IError }>()
);
export const CreateMasterTemplateSuccess = createAction(
  '[Configuration] Create Master Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// Update Template
export const UpdateMasterTemplate = createAction(
  '[Configuration] Update Master Template',
  props<{ payload: ITemplates.IUpdate }>()
);
export const UpdateMasterTemplateFail = createAction(
  '[Configuration] Update Master Template Fail',
  props<{ payload: IError }>()
);
export const UpdateMasterTemplateSuccess = createAction(
  '[Configuration] Update Master Template Success',
  props<{ payload: Update<ITemplates.IUpdate> }>()
);

// Delete Template
export const DeletetMasterTemplate = createAction(
  '[Configuration] Delete Master Template',
  props<{ payload: ITemplates.IDocument }>()
);
export const DeletetMasterTemplateFail = createAction(
  '[Configuration] Delete Master Template Fail',
  props<{ payload: IError }>()
);
export const DeletetMasterTemplateSuccess = createAction(
  '[Configuration] Delete Master Template Success',
  props<{ payload: ITemplates.IDocument }>()
);

// redirect
export const RedirectToMasterTemplates = createAction(
  '[Configuration] Redirect To Master Templates'
);

// Reset Selected Master Template
export const ResetSelectedMasterTemplate = createAction(
  '[Admin] Reset Selected Master Template'
);

const all = union({
  SetMasterTemplatesPage,
  LoadMasterTemplates,
  LoadMasterTemplatesFail,
  LoadMasterTemplatesSuccess,
  ActivateMasterTemplate,
  ActivateMasterTemplateFail,
  ActivateMasterTemplatesSuccess,
  DeactivateMasterTemplate,
  DeactivateMasterTemplateFail,
  DeactivateMasterTemplateSuccess,
  ResetMasterTemplateStatus,
  GetMasterTemplate,
  GetMasterTemplateFail,
  GetMasterTemplateSuccess,
  CreateMasterTemplate,
  CreateMasterTemplateFail,
  CreateMasterTemplateSuccess,
  UpdateMasterTemplate,
  UpdateMasterTemplateFail,
  UpdateMasterTemplateSuccess,
  DeletetMasterTemplate,
  DeletetMasterTemplateFail,
  DeletetMasterTemplateSuccess,
  RedirectToMasterTemplates,
  ResetSelectedMasterTemplate
});
export type MasterTemplatesActionsUnion = typeof all;
