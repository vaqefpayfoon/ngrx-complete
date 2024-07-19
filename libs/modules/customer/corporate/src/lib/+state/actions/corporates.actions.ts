import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { ICorporates } from '../../models';
import { IError } from '@neural/shared/data';
import { Auth } from '@neural/auth';

// Set Corporates Page
export const SetCorporatesPage = createAction(
  '[Customer] Set Corporates Page',
  props<{ payload: ICorporates.IConfig }>()
);

// Load Corporates
export const LoadCorporates = createAction('[Customer] Load Corporates');
export const LoadCorporatesFail = createAction(
  '[Customer] Load Corporates Fail',
  props<{ payload: any }>()
);
export const LoadCorporatesSuccess = createAction(
  '[Customer] Load Corporates Success',
  props<{
    corporates: ICorporates.IDocument[];
    pagination: ICorporates.IPagination;
  }>()
);

// Load Corporate
export const LoadCorporate = createAction(
  '[Customer] Load Corporate',
  props<{ payload: string }>()
);
export const LoadCorporateFail = createAction(
  '[Customer] Load Corporate Fail',
  props<{ payload: any }>()
);
export const LoadCorporateSuccess = createAction(
  '[Customer] Load Corporate Success',
  props<{ payload: ICorporates.IDocument }>()
);

// Select Corporatee
export const SelectCorporate = createAction(
  '[Customer] Select Corporate',
  props<{ payload: ICorporates.IDocument }>()
);

// Activate Corporate
export const ActivateCorporate = createAction(
  '[Customer] Activate Corporate',
  props<{ payload: ICorporates.IDocument }>()
);
export const ActivateCorporateFail = createAction(
  '[Customer] Activate Corporate Fail',
  props<{ payload: any }>()
);
export const ActivateCorporateSuccess = createAction(
  '[Customer] Activate Corporate Success',
  props<{ payload: Update<ICorporates.IDocument> }>()
);

// Deactivate Corporates
export const DeactivateCorporate = createAction(
  '[Customer] Deactivate Corporate',
  props<{ payload: ICorporates.IDocument }>()
);
export const DeactivateCorporateFail = createAction(
  '[Customer] Deactivate Corporate Fail',
  props<{ payload: any }>()
);
export const DeactivateCorporateSuccess = createAction(
  '[Customer] Deactivate Corporate Success',
  props<{ payload: Update<ICorporates.IDocument> }>()
);

// Create Corporate
export const CreateCorporate = createAction(
  '[Customer] Create Corporate',
  props<{ payload: ICorporates.ICreate }>()
);
export const CreateCorporateFail = createAction(
  '[Customer] Create Corporate Fail',
  props<{ payload: any }>()
);
export const CreateCorporateSuccess = createAction(
  '[Customer] Create Corporate Success',
  props<{ payload: ICorporates.IDocument }>()
);

// Update Corporate
export const UpdateCorporate = createAction(
  '[Customer] Update Corporate',
  props<{ payload: ICorporates.IDocument }>()
);
export const UpdateCorporateFail = createAction(
  '[Customer] Update Corporate Fail',
  props<{ payload: any }>()
);
export const UpdateCorporateSuccess = createAction(
  '[Customer] Update Corporate Success',
  props<{ payload: Update<ICorporates.IDocument> }>()
);

// Update Corporate Image
export const UpdateCorporateImage = createAction(
  '[Customer] Update Corporate Image',
  props<{ payload: ICorporates.IDocument }>()
);
export const UpdateCorporateImageFail = createAction(
  '[Customer] Update Corporate Image Fail',
  props<{ payload: any }>()
);
export const UpdateCorporateImageSuccess = createAction(
  '[Customer] Update Corporate Image Success',
  props<{ payload: Update<ICorporates.IDocument> }>()
);

// Reset Corporate Status
export const ResetCorporateStatus = createAction(
  '[Customer] Reset Corporate Status',
  props<{ payload: Update<ICorporates.IDocument> }>()
);

// Reset Selected Corporate
export const ResetSelectedCorporate = createAction(
  '[Customer] Reset Selected Corporate'
);

// Upload Social Icon
export const UploadSocialIcon = createAction(
  '[Customer] Upload Social Icon',
  props<{
    payload: { file: any; index: number; corporate: ICorporates.IDocument };
  }>()
);
export const UploadSocialIconFail = createAction(
  '[Customer] Upload Social Icon Fail',
  props<{ payload: any }>()
);
export const UploadSocialIconSuccess = createAction(
  '[Customer] Upload Social Icon Success',
  props<{ payload: string }>()
);

// Upload App Image
export const UploadAppImage = createAction(
  '[Customer] Upload App Image',
  props<{ payload: ICorporates.IAppImageUploadAction }>()
);
export const UploadAppImageFail = createAction(
  '[Customer] Upload App Image Fail',
  props<{ payload: any }>()
);
export const UploadAppImageSuccess = createAction(
  '[Customer] Upload App Image Success',
  props<{ payload: { [name: string]: string } }>()
);

// redirect
export const RedirectToCorporates = createAction(
  '[Configuration] Redirect To Corporates'
);

// Get Sales advisors
export const GetCorporateOperations = createAction(
  '[Hub] Get Corporate Operations',
  props<{ payload }>()
);
export const GetCorporateOperationsFail = createAction(
  '[Hub] Get Corporate Operations Fail',
  props<{ payload: IError }>()
);
export const GetCorporateOperationsSuccess = createAction(
  '[Hub] Get Corporate Operations Success',
  props<{ payload: Auth.IAccount[] }>()
);
const all = union({
  SetCorporatesPage,
  SelectCorporate,
  LoadCorporates,
  LoadCorporatesFail,
  LoadCorporatesSuccess,
  LoadCorporate,
  LoadCorporateFail,
  LoadCorporateSuccess,
  ActivateCorporate,
  ActivateCorporateFail,
  ActivateCorporateSuccess,
  DeactivateCorporate,
  DeactivateCorporateFail,
  DeactivateCorporateSuccess,
  CreateCorporate,
  CreateCorporateFail,
  CreateCorporateSuccess,
  UpdateCorporate,
  UpdateCorporateFail,
  UpdateCorporateSuccess,
  ResetCorporateStatus,
  ResetSelectedCorporate,
  UpdateCorporateImage,
  UpdateCorporateImageFail,
  UpdateCorporateImageSuccess,
  UploadSocialIcon,
  UploadSocialIconFail,
  UploadSocialIconSuccess,
  RedirectToCorporates,
  UploadAppImage,
  UploadAppImageFail,
  UploadAppImageSuccess,
  GetCorporateOperations,
  GetCorporateOperationsSuccess,
  GetCorporateOperationsFail,
});
export type CorporatesActionsUnion = typeof all;
