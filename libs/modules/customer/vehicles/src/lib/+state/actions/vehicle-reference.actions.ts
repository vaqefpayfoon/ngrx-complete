import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IVehicleReference } from '../../models';

// Set Vehicle Reference Page
export const SetVehicleReferencePage = createAction(
  '[Customer] Set Vehicle Reference Page',
  props<{ payload: IVehicleReference.IConfig }>()
);

// Change Vehicle Reference Page
export const ChangeVehicleReferencePage = createAction(
  '[Customer] Change Vehicle Reference Page',
  props<{ payload: IVehicleReference.IConfig }>()
);

// Filter Vehicle Reference
export const FilterVehicleReference = createAction(
  '[Customer] Set Filter Vehicle Reference',
  props<{ payload: IVehicleReference.IFilter }>()
);

// Sort Vehicle Reference
export const SortVehicleReference = createAction(
  '[Customer] Sort Vehicle Reference',
  props<{ payload: IVehicleReference.ISort }>()
);

// Reset Filter Vehicle Reference
export const ResetFilterVehicleReference = createAction(
  '[Customer] Reset Filter Vehicle Reference'
);

// Reset Sort Vehicle Reference
export const ResetSortVehicleReference = createAction(
  '[Customer] Reset Sort Vehicle Reference'
);

// Load Vehicle Reference
export const LoadVehicleReference = createAction(
  '[Customer] Load Vehicle Reference'
);
export const LoadVehicleReferenceFail = createAction(
  '[Customer] Load Vehicle Reference Fail',
  props<{ payload: any }>()
);
export const LoadVehicleReferenceSuccess = createAction(
  '[Customer] Load Vehicle Reference Success',
  props<{
    vehicleReference: IVehicleReference.IDocument[];
    pagination: IVehicleReference.IPagination;
  }>()
);

// Create Vehicle Reference
export const CreateVehicleReference = createAction(
  '[Customer] Create Vehicle Reference',
  props<{ payload: IVehicleReference.ICreate }>()
);
export const CreateVehicleReferenceFail = createAction(
  '[Customer] Create Vehicle Reference Fail',
  props<{ payload: any }>()
);
export const CreateVehicleReferenceSuccess = createAction(
  '[Customer] Create Vehicle Reference Success',
  props<{ payload: IVehicleReference.IDocument }>()
);

// Get Vehicle Reference
export const GetVehicleReference = createAction(
  '[Customer] Get Vehicle Reference',
  props<{ payload: string }>()
);
export const GetVehicleReferenceFail = createAction(
  '[Customer] Get Vehicle Reference Fail',
  props<{ payload: any }>()
);
export const GetVehicleReferenceSuccess = createAction(
  '[Customer] Get Vehicle Reference Success',
  props<{ payload: IVehicleReference.IDocument }>()
);

// Update Vehicle Reference
export const UpdateVehicleReference = createAction(
  '[Customer] Update Vehicle Reference',
  props<{ payload: IVehicleReference.IDocument }>()
);
export const UpdateVehicleReferenceFail = createAction(
  '[Customer] Update Vehicle Reference Fail',
  props<{ payload: any }>()
);
export const UpdateVehicleReferenceSuccess = createAction(
  '[Customer] Update Vehicle Reference Success',
  props<{ payload: Update<IVehicleReference.IDocument> }>()
);

// Activate Vehicle Reference
export const ActivateVehicleReference = createAction(
  '[Customer] Activate Vehicle Reference',
  props<{ payload: IVehicleReference.IDocument }>()
);
export const ActivateVehicleReferenceFail = createAction(
  '[Customer] Activate Vehicle Reference Fail',
  props<{ payload: any }>()
);
export const ActivateVehicleReferenceSuccess = createAction(
  '[Customer] Activate Vehicle Reference Success',
  props<{ payload: Update<IVehicleReference.IDocument> }>()
);

// Deactivate Vehicle Reference
export const DeactivateVehicleReference = createAction(
  '[Customer] Deactivate Vehicle Reference',
  props<{ payload: IVehicleReference.IDocument }>()
);
export const DeactivateVehicleReferenceFail = createAction(
  '[Customer] Deactivate Vehicle Reference Fail',
  props<{ payload: any }>()
);
export const DeactivateVehicleReferenceSuccess = createAction(
  '[Customer] Deactivate Vehicle Reference Success',
  props<{ payload: Update<IVehicleReference.IDocument> }>()
);

// vehicle reference brands
export const LoadVehicleReferenceBrands = createAction(
  '[Customer] Load Vehicle Reference Brands',
  props<{ payload: { type: string } }>()
);
export const LoadVehicleReferenceBrandsFail = createAction(
  '[Customer] Load Vehicle Reference Brands Fail',
  props<{ payload: any }>()
);
export const LoadVehicleReferenceBrandsSuccess = createAction(
  '[Customer] Load Vehicle Brands Success',
  props<{ payload: string[] }>()
);

// vehicle reference models
export const LoadVehicleReferenceModels = createAction(
  '[Customer] Load Vehicle Reference Models',
  props<{ payload: { type: string, brand: string } }>()
);
export const LoadVehicleReferenceModelsFail = createAction(
  '[Customer] Load Vehicle Models Fail',
  props<{ payload: any }>()
);
export const LoadVehicleReferenceModelsSuccess = createAction(
  '[Customer] Load Vehicle Reference Models Success',
  props<{ payload: string[] }>()
);

// vehicle reference variants
export const LoadVehicleReferenceVariants = createAction(
  '[Customer] Load Vehicle Reference Variants',
  props<{ payload: { type: string, brand: string; model: string } }>()
);
export const LoadVehicleReferenceVariantsFail = createAction(
  '[Customer] Load Vehicle Reference Variants Fail',
  props<{ payload: any }>()
);
export const LoadVehicleReferenceVariantsSuccess = createAction(
  '[Customer] Load Vehicle Reference Variants Success',
  props<{ payload: IVehicleReference.IVariants[] }>()
);

// Reset reference List
export const ResetList = createAction(
  '[Customer] Reset Reference List',
  props<{ payload: string }>()
);

// Reset Vehicle Reference Status
export const ResetVehicleReferenceStatus = createAction(
  '[Customer] Reset Vehicle Reference Status',
  props<{ payload: Update<IVehicleReference.IDocument> }>()
);

// redirect
export const RedirectToVehicleReferences = createAction(
  '[Configuration] Redirect To Vehicle References'
);

// Reset Selected Vehicle Reference
export const ResetSelectedVehicleReference = createAction(
  '[Customer] Reset Selected Vehicle Reference'
);

const all = union({
  SetVehicleReferencePage,
  ChangeVehicleReferencePage,
  FilterVehicleReference,
  SortVehicleReference,
  ResetFilterVehicleReference,
  ResetSortVehicleReference,
  LoadVehicleReference,
  LoadVehicleReferenceFail,
  LoadVehicleReferenceSuccess,
  CreateVehicleReference,
  CreateVehicleReferenceFail,
  CreateVehicleReferenceSuccess,
  GetVehicleReference,
  GetVehicleReferenceFail,
  GetVehicleReferenceSuccess,
  UpdateVehicleReference,
  UpdateVehicleReferenceFail,
  UpdateVehicleReferenceSuccess,
  ActivateVehicleReference,
  ActivateVehicleReferenceFail,
  ActivateVehicleReferenceSuccess,
  DeactivateVehicleReference,
  DeactivateVehicleReferenceFail,
  DeactivateVehicleReferenceSuccess,
  LoadVehicleReferenceBrands,
  LoadVehicleReferenceBrandsFail,
  LoadVehicleReferenceBrandsSuccess,
  LoadVehicleReferenceModels,
  LoadVehicleReferenceModelsFail,
  LoadVehicleReferenceModelsSuccess,
  LoadVehicleReferenceVariants,
  LoadVehicleReferenceVariantsFail,
  LoadVehicleReferenceVariantsSuccess,
  ResetList,
  ResetVehicleReferenceStatus,
  RedirectToVehicleReferences,
  ResetSelectedVehicleReference
});
export type VehicleReferenceActionsUnion = typeof all;
