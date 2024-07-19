import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IProductReferences } from '../../models';

// Set Product References Page
export const SetProductReferencesPage = createAction(
  '[MarketPlaces] Set References Page',
  props<{ payload: IProductReferences.IConfig }>()
);

// Load References
export const LoadProductReferences = createAction(
  '[MarketPlaces] Load Product References'
);
export const LoadProductReferencesFail = createAction(
  '[MarketPlaces] Load Product References Fail',
  props<{ payload: any }>()
);
export const LoadProductReferencesSuccess = createAction(
  '[MarketPlaces] Load Product References Success',
  props<{
    references: IProductReferences.IDocument[];
    pagination: IProductReferences.IPagination;
  }>()
);

// Create Product Reference
export const CreateProductReference = createAction(
  '[MarketPlaces] Create Product Reference',
  props<{ payload: IProductReferences.ICreate }>()
);
export const CreateProductReferenceFail = createAction(
  '[MarketPlaces] Create Product Reference Fail',
  props<{ payload: any }>()
);
export const CreateProductReferenceSuccess = createAction(
  '[MarketPlaces] Create Product Reference Success',
  props<{ payload: IProductReferences.IDocument }>()
);

// Get Product Reference
export const GetProductReference = createAction(
  '[MarketPlaces] Get Product Reference',
  props<{ payload: string }>()
);
export const GetProductReferenceFail = createAction(
  '[MarketPlaces] Get Product Reference Fail',
  props<{ payload: any }>()
);
export const GetProductReferenceSuccess = createAction(
  '[MarketPlaces] Get Product Reference Success',
  props<{ payload: IProductReferences.IDocument }>()
);

// Update Product Reference
export const UpdateProductReference = createAction(
  '[MarketPlaces] Update Product Reference',
  props<{ payload: IProductReferences.IDocument }>()
);
export const UpdateProductReferenceFail = createAction(
  '[MarketPlaces] Update Product Reference Fail',
  props<{ payload: any }>()
);
export const UpdateProductReferenceSuccess = createAction(
  '[MarketPlaces] Update Product Reference Success',
  props<{ payload: Update<IProductReferences.IDocument> }>()
);

// Activate Product Reference
export const ActivateProductReference = createAction(
  '[MarketPlaces] Activate Product Reference',
  props<{ payload: IProductReferences.IDocument }>()
);
export const ActivateProductReferenceFail = createAction(
  '[MarketPlaces] Activate Product Reference Fail',
  props<{ payload: any }>()
);
export const ActivateProductReferenceSuccess = createAction(
  '[MarketPlaces] Activate Product Reference Success',
  props<{ payload: Update<IProductReferences.IDocument> }>()
);

// Deactivate Product Reference
export const DeactivateProductReference = createAction(
  '[MarketPlaces] Deactivate Product Reference',
  props<{ payload: IProductReferences.IDocument }>()
);
export const DeactivateProductReferenceFail = createAction(
  '[MarketPlaces] Deactivate Product Reference Fail',
  props<{ payload: any }>()
);
export const DeactivateProductReferenceSuccess = createAction(
  '[MarketPlaces] Deactivate Product Reference Success',
  props<{ payload: Update<IProductReferences.IDocument> }>()
);

// Reset Product Reference Status
export const ResetProductReferenceStatus = createAction(
  '[MarketPlaces] Reset Product Reference Status',
  props<{ payload: Update<IProductReferences.IDocument> }>()
);

// redirect
export const RedirectToProductReferences = createAction(
  '[Configuration] Redirect To Product References'
);

// Reset Selected Product Reference
export const ResetSelectedProductReference = createAction(
  '[MarketPlaces] Reset Selected Product Reference'
);

const all = union({
  SetProductReferencesPage,
  LoadProductReferences,
  LoadProductReferencesFail,
  LoadProductReferencesSuccess,
  ActivateProductReference,
  ActivateProductReferenceFail,
  ActivateProductReferenceSuccess,
  DeactivateProductReference,
  DeactivateProductReferenceFail,
  DeactivateProductReferenceSuccess,
  ResetProductReferenceStatus,
  CreateProductReference,
  CreateProductReferenceFail,
  CreateProductReferenceSuccess,
  GetProductReference,
  GetProductReferenceFail,
  GetProductReferenceSuccess,
  UpdateProductReference,
  UpdateProductReferenceFail,
  UpdateProductReferenceSuccess,
  RedirectToProductReferences,
  ResetSelectedProductReference
});
export type ProductReferencesActionsUnion = typeof all;
