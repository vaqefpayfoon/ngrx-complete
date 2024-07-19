import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IProductCoverages } from '../../models';

// Set Product Coverages Page
export const SetProductCoveragesPage = createAction(
  '[MarketPlaces] Set Coverages Page',
  props<{ payload: IProductCoverages.IConfig }>()
);

// Load Coverages
export const LoadProductCoverages = createAction(
  '[MarketPlaces] Load Product Coverages'
);
export const LoadProductCoveragesFail = createAction(
  '[MarketPlaces] Load Product Coverages Fail',
  props<{ payload: any }>()
);
export const LoadProductCoveragesSuccess = createAction(
  '[MarketPlaces] Load Product Coverages Success',
  props<{
    coverages: IProductCoverages.IDocument[];
    pagination: IProductCoverages.IPagination;
  }>()
);

// Activate Product Coverage
export const ActivateProductCoverage = createAction(
  '[MarketPlaces] Activate Product Coverage',
  props<{ payload: IProductCoverages.IDocument }>()
);
export const ActivateProductCoverageFail = createAction(
  '[MarketPlaces] Activate Product Coverage Fail',
  props<{ payload: any }>()
);
export const ActivateProductCoverageSuccess = createAction(
  '[MarketPlaces] Activate Product Coverage Success',
  props<{ payload: Update<IProductCoverages.IDocument> }>()
);

// Deactivate Product Coverage
export const DeactivateProductCoverage = createAction(
  '[MarketPlaces] Deactivate Product Coverage',
  props<{ payload: IProductCoverages.IDocument }>()
);
export const DeactivateProductCoverageFail = createAction(
  '[MarketPlaces] Deactivate Product Coverage Fail',
  props<{ payload: any }>()
);
export const DeactivateProductCoverageSuccess = createAction(
  '[MarketPlaces] Deactivate Product Coverage Success',
  props<{ payload: Update<IProductCoverages.IDocument> }>()
);

// Delete Product Coverage
export const DeleteProductCoverage = createAction(
  '[MarketPlaces] Delete Product Coverage',
  props<{ payload: IProductCoverages.IDocument }>()
);
export const DeleteProductCoverageFail = createAction(
  '[MarketPlaces] Delete Product Coverage Fail',
  props<{ payload: any }>()
);
export const DeleteProductCoverageSuccess = createAction(
  '[MarketPlaces] Delete Product Coverage Success',
  props<{ payload: IProductCoverages.IDocument }>()
);

// Reset Product Coverage Status
export const ResetProductCoverageStatus = createAction(
  '[MarketPlaces] Reset Product Coverage Status',
  props<{ payload: Update<IProductCoverages.IDocument> }>()
);

// Create Product Coverage
export const CreateProductCoverage = createAction(
  '[MarketPlaces] Create Product Coverage',
  props<{ payload: IProductCoverages.ICreate }>()
);
export const CreateProductCoverageFail = createAction(
  '[MarketPlaces] Create Product Coverage Fail',
  props<{ payload: any }>()
);
export const CreateProductCoverageSuccess = createAction(
  '[MarketPlaces] Create Product Coverage Success',
  props<{ payload: IProductCoverages.IDocument }>()
);

// Get Product Coverage
export const GetProductCoverage = createAction(
  '[Admin] Get Product Coverage',
  props<{ payload: string }>()
);
export const GetProductCoverageFail = createAction(
  '[Admin] Get Product Coverage Fail',
  props<{ payload: any }>()
);
export const GetProductCoverageSuccess = createAction(
  '[Admin] Get Product Coverage Success',
  props<{ payload: IProductCoverages.IDocument }>()
);

// Update Product Coverage
export const UpdateProductCoverage = createAction(
  '[MarketPlaces] Update Product Coverage',
  props<{ payload: IProductCoverages.IDocument }>()
);
export const UpdateProductCoverageFail = createAction(
  '[MarketPlaces] Update Product Coverage Fail',
  props<{ payload: any }>()
);
export const UpdateProductCoverageSuccess = createAction(
  '[MarketPlaces] Update Product Coverage Success',
  props<{ payload: Update<IProductCoverages.IDocument> }>()
);

// Load Product Brands
export const LoadProductBrands = createAction(
  '[MarketPlaces] Load Product Brands',
  props<{ payload: string }>()
);
export const LoadProductBrandsFail = createAction(
  '[MarketPlaces] Load Product Brands Fail',
  props<{ payload: any }>()
);
export const LoadProductBrandsSuccess = createAction(
  '[MarketPlaces] Load Product Brands Success',
  props<{ payload: string[] }>()
);

// Load Product Models
export const LoadProductModels = createAction(
  '[MarketPlaces] Load Product Models',
  props<{ payload: { brand: string; serviceType: string } }>()
);
export const LoadProductModelsFail = createAction(
  '[MarketPlaces] Load Product Models Fail',
  props<{ payload: any }>()
);
export const LoadProductModelsSuccess = createAction(
  '[MarketPlaces] Load Product Models Success',
  props<{ payload: IProductCoverages.IModel[] }>()
);

// Reset List
export const ResetList = createAction(
  '[MarketPlaces] Reset List',
  props<{ payload: string }>()
);

// Reset Selected Product Coverage
export const ResetSelectedProductCoverage = createAction(
  '[MarketPlaces] Reset Selected Product Coverage'
);

// redirect
export const RedirectToProductCoverages = createAction(
  '[MarketPlaces] Redirect To Product Coverages'
);

const all = union({
  SetProductCoveragesPage,
  LoadProductCoverages,
  LoadProductCoveragesFail,
  LoadProductCoveragesSuccess,
  ActivateProductCoverage,
  ActivateProductCoverageFail,
  ActivateProductCoverageSuccess,
  DeactivateProductCoverage,
  DeactivateProductCoverageFail,
  DeactivateProductCoverageSuccess,
  ResetProductCoverageStatus,
  CreateProductCoverage,
  CreateProductCoverageFail,
  CreateProductCoverageSuccess,
  GetProductCoverage,
  GetProductCoverageFail,
  GetProductCoverageSuccess,
  UpdateProductCoverage,
  UpdateProductCoverageFail,
  UpdateProductCoverageSuccess,
  LoadProductBrands,
  LoadProductBrandsFail,
  LoadProductBrandsSuccess,
  LoadProductModels,
  LoadProductModelsFail,
  LoadProductModelsSuccess,
  ResetList,
  DeleteProductCoverage,
  DeleteProductCoverageFail,
  DeleteProductCoverageSuccess,
  ResetSelectedProductCoverage,
  RedirectToProductCoverages
});
export type ProductCoveragesActionsUnion = typeof all;
