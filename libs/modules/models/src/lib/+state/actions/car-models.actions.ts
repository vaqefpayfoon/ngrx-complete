import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IModels } from '../../models';

// Set Models Page
export const SetModelsPage = createAction(
  '[Admin] Set Models Page',
  props<{ payload: IModels.IConfig }>()
);

// Load Models
export const LoadModels = createAction('[Admin] Load Models');
export const LoadModelsFail = createAction(
  '[Admin] Load Models Fail',
  props<{ payload: any }>()
);
export const LoadModelsSuccess = createAction(
  '[Admin] Load Models Success',
  props<{ models: IModels.IDocument[]; pagination: IModels.IPagination }>()
);

// Create Models
export const CreateModel = createAction(
  '[Admin] Create Model',
  props<{ payload: IModels.ICreate }>()
);
export const CreateModelFail = createAction(
  '[Admin] Create Model Fail',
  props<{ payload: any }>()
);
export const CreateModelSuccess = createAction(
  '[Admin] Create Model Success',
  props<{ payload: IModels.IDocument }>()
);

// Update Model
export const UpdateModel = createAction(
  '[Admin] Update Model',
  props<{ payload: IModels.IDocument }>()
);
export const UpdateModelFail = createAction(
  '[Admin] Update Model Fail',
  props<{ payload: any }>()
);
export const UpdateModelSuccess = createAction(
  '[Admin] Update Model Success',
  props<{ payload: Update<IModels.IDocument> }>()
);

// Activate Models
export const ActivateModel = createAction(
  '[Admin] Activate Model',
  props<{ payload: IModels.IDocument }>()
);
export const ActivateModelFail = createAction(
  '[Admin] Activate Model Fail',
  props<{ payload: any }>()
);
export const ActivateModelSuccess = createAction(
  '[Admin] Activate Model Success',
  props<{ payload: Update<IModels.IDocument> }>()
);

// Deactivate Models
export const DeactivateModel = createAction(
  '[Admin] Deactivate Model',
  props<{ payload: IModels.IDocument }>()
);
export const DeactivateModelFail = createAction(
  '[Admin] Deactivate Model Fail',
  props<{ payload: any }>()
);
export const DeactivateModelSuccess = createAction(
  '[Admin] Deactivate Model Success',
  props<{ payload: Update<IModels.IDocument> }>()
);

// Get Model
export const GetModel = createAction(
  '[Admin] Get Model',
  props<{ payload: string }>()
);
export const GetModelFail = createAction(
  '[Admin] Get Model Fail',
  props<{ payload: any }>()
);
export const GetModelSuccess = createAction(
  '[Admin] Get Model Success',
  props<{ payload: IModels.IDocument }>()
);

// Reset Model Status
export const ResetModelStatus = createAction(
  '[Admin] Reset Model Status',
  props<{ payload: Update<IModels.IDocument> }>()
);

// Reset Selected Model
export const ResetSelectedModel = createAction(
  '[Admin] Reset Selected Model'
);

// Upload Interior Gallery Color Image
export const UploadInteriorGalleryColorImage = createAction(
  '[Admin] Upload Interior Gallery Color Image',
  props<{ payload: { model: IModels.IFile; index: number } }>()
);
export const UploadInteriorGalleryColorImageFail = createAction(
  '[Admin] Upload Interior Gallery Image Color Fail',
  props<{ payload: any }>()
);
export const UploadInteriorGalleryColorImageSuccess = createAction(
  '[Admin] Upload Interior Gallery Image Color Success',
  props<{ payload: string }>()
);

// Upload Exterior Gallery Color Image
export const UploadExteriorGalleryColorImage = createAction(
  '[Admin] Upload Exterior Gallery Color Image',
  props<{ payload: { model: IModels.IFile; index: number } }>()
);
export const UploadExteriorGalleryColorImageFail = createAction(
  '[Admin] Upload Exterior Gallery Image Color Fail',
  props<{ payload: any }>()
);
export const UploadExteriorGalleryColorImageSuccess = createAction(
  '[Admin] Upload Exterior Gallery Image Color Success',
  props<{ payload: string }>()
);

// Upload Interior Gallery Images
export const UploadInteriorGalleryImages = createAction(
  '[Admin] Upload Interior Gallery Images',
  props<{ payload: { model: IModels.IFile; index: number } }>()
);
export const UploadInteriorGalleryImagesFail = createAction(
  '[Admin] Upload Interior Gallery Images Fail',
  props<{ payload: any }>()
);
export const UploadInteriorGalleryImagesSuccess = createAction(
  '[Admin] Upload Interior Gallery Images Success',
  props<{ payload: string }>()
);

// Upload Exterior Gallery Images
export const UploadExteriorGalleryImages = createAction(
  '[Admin] Upload Exterior Gallery Images',
  props<{ payload: { model: IModels.IFile; index: number } }>()
);
export const UploadExteriorGalleryImagesFail = createAction(
  '[Admin] Upload Exterior Gallery Images Fail',
  props<{ payload: any }>()
);
export const UploadExteriorGalleryImagesSuccess = createAction(
  '[Admin] Upload Exterior Gallery Images Success',
  props<{ payload: string }>()
);

// Set Branches
export const SetBranches = createAction(
  '[Admin] Set Branches',
  props<{
    payload: { model: IModels.IDocument; branches: IModels.ISetBranches };
  }>()
);
export const SetBranchesFail = createAction(
  '[Admin] Set Branches Fail',
  props<{ payload: any }>()
);
export const SetBranchesSuccess = createAction(
  '[Admin] Set Branches Success',
  props<{ payload: Update<IModels.IDocument> }>()
);

// Set Branch For All Brands
export const SetBranch = createAction(
  '[Admin] Set Branch',
  props<{ payload: IModels.ISetBranches }>()
);
export const SetBranchFail = createAction(
  '[Admin] Set Branch Fail',
  props<{ payload: any }>()
);
export const SetBranchSuccess = createAction('[Admin] Set Branch Success');

// Get Brands And Series
export const GetBrandsAndSeries = createAction('[Admin] Get Brands And Series');
export const GetBrandsAndSeriesFail = createAction(
  '[Admin] Get Brands And Series Fail',
  props<{ payload: any }>()
);
export const GetBrandsAndSeriesSuccess = createAction(
  '[Admin] Get Brands And Series Success',
  props<{ payload: IModels.IBrand[] }>()
);

// Get Series Models
export const GetSeriesModels = createAction(
  '[Admin] Get Series Models',
  props<{ brand: string; series: string }>()
);
export const GetSeriesModelsFail = createAction(
  '[Admin] Get Series Models Fail',
  props<{ payload: any }>()
);
export const GetSeriesModelsSuccess = createAction(
  '[Admin] Get Series Models Success',
  props<{ payload: IModels.ISeries }>()
);

// Get Series Models
export const GetVariants = createAction(
  '[Admin] Get Variants',
  props<{ payload: IModels.IVariant }>()
);
export const GetVariantsFail = createAction(
  '[Admin] Get Variants Fail',
  props<{ payload: any }>()
);
export const GetVariantsSuccess = createAction(
  '[Admin] Get Variants Success',
  props<{ payload: IModels.IDocument[] }>()
);

// Upload Series Image
export const UploadSeriesImage = createAction(
  '[Admin] Upload Series Image',
  props<{ payload: IModels.ISetSeriesImage }>()
);
export const UploadSeriesImageFail = createAction(
  '[Admin] Upload Series Image Fail',
  props<{ payload: any }>()
);
export const UploadSeriesImageSuccess = createAction(
  '[Admin] Upload Series Image Success',
  props<{ payload: string }>()
);

// Upload Model Image
export const UpdateModelImage = createAction(
  '[Admin] Update Model Image',
  props<{ payload: IModels.ISetModelImage }>()
);
export const UpdateModelImageFail = createAction(
  '[Admin] Update Model Image Fail',
  props<{ payload: any }>()
);
export const UpdateModelImageSuccess = createAction(
  '[Admin] Update Model Image Success',
  props<{ payload: string }>()
);

// Get Model Image
export const GetModelImage = createAction(
  '[Admin] Get Model Image',
  props<{ payload: IModels.IDocument }>()
);
export const GetModelImageFail = createAction(
  '[Admin] Get Model Image Fail',
  props<{ payload: any }>()
);
export const GetModelImageSuccess = createAction(
  '[Admin] Get Model Image Success',
  props<{ payload: IModels.IDocument }>()
);

// Select Model Image
export const SelectModelImage = createAction(
  '[Admin] Select Model Image',
  props<{ payload: IModels.IVariant }>()
);
export const SelectModelImageFail = createAction(
  '[Admin] Select Model Image Fail',
  props<{ payload: any }>()
);
export const SelectModelImageSuccess = createAction(
  '[Admin] Select Model Image Success',
  props<{ payload: string }>()
);

// Delete Model Gallery Image
export const DeleteModelGalleryImage = createAction(
  '[Admin] elete Model Gallery Image',
  props<{ payload: { uuid: string; image: string } }>()
);
export const DeleteModelGalleryImageFail = createAction(
  '[Admin] elete Model Gallery Image Fail',
  props<{ payload: any }>()
);
export const DeleteModelGalleryImageSuccess = createAction(
  '[Admin] elete Model Gallery Image Success'
);

// Reset Unit
export const ResetUnit = createAction('[Admin] Reset Unit');

// redirect
export const RedirectToCarModels = createAction(
  '[Admin] Redirect To Car Models'
);

const all = union({
  SetModelsPage,
  LoadModels,
  LoadModelsFail,
  LoadModelsSuccess,
  CreateModel,
  CreateModelFail,
  CreateModelSuccess,
  UpdateModel,
  UpdateModelFail,
  UpdateModelSuccess,
  ActivateModel,
  ActivateModelFail,
  ActivateModelSuccess,
  DeactivateModel,
  DeactivateModelFail,
  DeactivateModelSuccess,
  GetModel,
  GetModelFail,
  GetModelSuccess,
  ResetModelStatus,
  UploadInteriorGalleryColorImage,
  UploadInteriorGalleryColorImageFail,
  UploadInteriorGalleryColorImageSuccess,
  UploadExteriorGalleryColorImage,
  UploadExteriorGalleryColorImageFail,
  UploadExteriorGalleryColorImageSuccess,
  UploadInteriorGalleryImages,
  UploadInteriorGalleryImagesFail,
  UploadInteriorGalleryImagesSuccess,
  UploadExteriorGalleryImages,
  UploadExteriorGalleryImagesFail,
  UploadExteriorGalleryImagesSuccess,
  SetBranches,
  SetBranchesFail,
  SetBranchesSuccess,
  GetBrandsAndSeries,
  GetBrandsAndSeriesFail,
  GetBrandsAndSeriesSuccess,
  GetSeriesModels,
  GetSeriesModelsFail,
  GetSeriesModelsSuccess,
  SetBranch,
  SetBranchFail,
  SetBranchSuccess,
  UploadSeriesImage,
  UploadSeriesImageFail,
  UploadSeriesImageSuccess,
  GetModelImage,
  GetModelImageFail,
  GetModelImageSuccess,
  GetVariants,
  GetVariantsFail,
  GetVariantsSuccess,
  UpdateModelImage,
  UpdateModelImageFail,
  UpdateModelImageSuccess,
  ResetUnit,
  ResetSelectedModel,
  SelectModelImage,
  SelectModelImageFail,
  SelectModelImageSuccess,
  DeleteModelGalleryImage,
  DeleteModelGalleryImageFail,
  DeleteModelGalleryImageSuccess,
  RedirectToCarModels
});
export type CarModelsActionsUnion = typeof all;
