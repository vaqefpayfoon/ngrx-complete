import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IVehicle } from '../../models';
import { IError } from '@neural/shared/data';

// Set Vehicles Page
export const SetVehiclesPage = createAction(
  '[Customer] Set Vehicles Page',
  props<{ payload: IVehicle.IConfig }>()
);

// Change Vehicles Page
export const ChangeVehiclesPage = createAction(
  '[Customer] Change Vehicles Page',
  props<{ payload: IVehicle.IConfig }>()
);

// Filter Vehicles
export const FilterVehicles = createAction(
  '[Customer] Set Filter Vehicles',
  props<{ payload: IVehicle.IFilter }>()
);

// Sort Vehicles
export const SortVehicles = createAction(
  '[Customer] Sort Vehicles',
  props<{ payload: IVehicle.ISort }>()
);

// Reset Filter Vehicles
export const ResetFilterVehicles = createAction(
  '[Customer] Reset Filter Vehicles'
);

// Reset Sort Vehicles
export const ResetSortVehicles = createAction('[Customer] Reset Sort Vehicles');

// Load Vehicles
export const LoadVehicles = createAction('[Customer] Load Vehicles');
export const LoadVehiclesFail = createAction(
  '[Customer] Load Vehicles Fail',
  props<{ payload: any }>()
);
export const LoadVehiclesSuccess = createAction(
  '[Customer] Load Vehicles Success',
  props<{ vehicles: IVehicle.IDocument[]; pagination: IVehicle.IPagination }>()
);

// Load Vehicles Inspections
export const LoadVehiclesInspections = createAction(
  '[Customer] Load Vehicles Inspections',
  props<{ payload: string }>()
);
export const LoadVehiclesInspectionsFail = createAction(
  '[Customer] Load Vehicles Inspections Fail',
  props<{ payload: any }>()
);
export const LoadVehiclesInspectionsSuccess = createAction(
  '[Customer] Load Vehicles Inspections Success',
  props<{
    inspections: IVehicle.IInspection[];
    pagination: IVehicle.IPagination;
  }>()
);

// Update Vehicle
export const UpdateVehicle = createAction(
  '[Customer] Update Vehicle',
  props<{
    payload: { document: IVehicle.IDocument; update: IVehicle.IUpdate };
  }>()
);
export const UpdateVehicleFail = createAction(
  '[Customer] Update Vehicle Fail',
  props<{ payload: any }>()
);
export const UpdateVehicleSuccess = createAction(
  '[Customer] Update Vehicle Success',
  props<{ payload: Update<IVehicle.IDocument> }>()
);

// Update Searched Vehicle
export const UpdateSearchedVehicle = createAction(
  '[Customer] Update Searched Vehicle',
  props<{
    payload: { document: IVehicle.IDocument; update: IVehicle.IUpdate };
  }>()
);
export const UpdateSearchedVehicleFail = createAction(
  '[Customer] Update Searched Vehicle Fail',
  props<{ payload: IError }>()
);
export const UpdateSearchedVehicleSuccess = createAction(
  '[Customer] Update Searched Vehicle Success',
  props<{ payload: IVehicle.IDocument }>()
);

// Activate Vehicles
export const ActivateVehicle = createAction(
  '[Customer] Activate Vehicle',
  props<{ payload: IVehicle.IDocument }>()
);
export const ActivateVehicleFail = createAction(
  '[Customer] Activate Vehicle Fail',
  props<{ payload: any }>()
);
export const ActivateVehicleSuccess = createAction(
  '[Customer] Activate Vehicle Success',
  props<{ payload: Update<IVehicle.IDocument> }>()
);

// Deactivate Vehicles
export const DeactivateVehicle = createAction(
  '[Customer] Deactivate Vehicle',
  props<{ payload: IVehicle.IDocument }>()
);
export const DeactivateVehicleFail = createAction(
  '[Customer] Deactivate Vehicle Fail',
  props<{ payload: any }>()
);
export const DeactivateVehicleSuccess = createAction(
  '[Customer] Deactivate Vehicle Success',
  props<{ payload: Update<IVehicle.IDocument> }>()
);

// Get Vehicle
export const GetVehicle = createAction(
  '[Customer] Get Vehicle',
  props<{ payload: string }>()
);
// Get Vehicle Fail
export const GetVehicleFail = createAction(
  '[Customer] Get Vehicle Fail',
  props<{ payload: any }>()
);
// Get Vehicle Success
export const GetVehicleSuccess = createAction(
  '[Customer] Get Vehicle Success',
  props<{ payload: IVehicle.IDocument }>()
);

// Tyre Widths
export const TyreWidths = createAction('[Customer] Tyre Widths');
export const TyreWidthsFail = createAction(
  '[Customer] Tyre Widths Fail',
  props<{ payload: any }>()
);
export const TyreWidthsSuccess = createAction(
  '[Customer] Tyre Widths Success',
  props<{ payload: string[] }>()
);

// Tyre AspectRatios
export const TyreAspectRatios = createAction(
  '[Customer] Tyre AspectRatios',
  props<{ payload: { width: string } }>()
);
export const TyreAspectRatiosFail = createAction(
  '[Customer] Tyre AspectRatios Fail',
  props<{ payload: any }>()
);
export const TyreAspectRatiosSuccess = createAction(
  '[Customer] Tyre AspectRatios Success',
  props<{ payload: string[] }>()
);

// Tyre Rims
export const TyreRims = createAction(
  '[Customer] Tyre Rims',
  props<{ payload: { width: string; aspectRatio: string } }>()
);
export const TyreRimsFail = createAction(
  '[Customer] Tyre Rims Fail',
  props<{ payload: any }>()
);
export const TyreRimsSuccess = createAction(
  '[Customer] Tyre Rims Success',
  props<{ payload: string[] }>()
);

// Rear Tyre Widths
export const RearTyreWidths = createAction('[Customer] Rear Tyre Widths');
export const RearTyreWidthsFail = createAction(
  '[Customer] Rear Tyre Widths Fail',
  props<{ payload: any }>()
);
export const RearTyreWidthsSuccess = createAction(
  '[Customer] Rear Tyre Widths Success',
  props<{ payload: string[] }>()
);

// Rear Tyre AspectRatios
export const RearTyreAspectRatios = createAction(
  '[Customer] Rear Tyre AspectRatios',
  props<{ payload: { width: string } }>()
);
export const RearTyreAspectRatiosFail = createAction(
  '[Customer] Rear Tyre AspectRatios Fail',
  props<{ payload: any }>()
);
export const RearTyreAspectRatiosSuccess = createAction(
  '[Customer] Rear Tyre AspectRatios Success',
  props<{ payload: string[] }>()
);

// Rear Tyre Rims
export const RearTyreRims = createAction(
  '[Customer] Rear Tyre Rims',
  props<{ payload: { width: string; aspectRatio: string } }>()
);
export const RearTyreRimsFail = createAction(
  '[Customer] Rear Tyre Rims Fail',
  props<{ payload: any }>()
);
export const RearTyreRimsSuccess = createAction(
  '[Customer] Rear Tyre Rims Success',
  props<{ payload: string[] }>()
);

// Reset Tyre
export const ResetTyre = createAction(
  '[Customer] Reset Tyre',
  props<{ payload: string }>()
);

// vehicle brands
export const LoadVehicleBrands = createAction('[Customer] Load Vehicle Brands');
export const LoadVehicleBrandsFail = createAction(
  '[Customer] Load Vehicle Brands Fail',
  props<{ payload: any }>()
);
export const LoadVehicleBrandsSuccess = createAction(
  '[Customer] Load Vehicle Brands Success',
  props<{ payload: string[] }>()
);

// vehicle models
export const LoadVehicleModels = createAction(
  '[Customer] Load Vehicle Models',
  props<{ payload: { brand: string } }>()
);
export const LoadVehicleModelsFail = createAction(
  '[Customer] Load Vehicle Models Fail',
  props<{ payload: any }>()
);
export const LoadVehicleModelsSuccess = createAction(
  '[Customer] Load Vehicle Models Success',
  props<{ payload: string[] }>()
);

// vehicle variants
export const LoadVehicleVariants = createAction(
  '[Customer] Load Vehicle Variants',
  props<{ payload: { brand: string; model: string } }>()
);
export const LoadVehicleVariantsFail = createAction(
  '[Customer] Load Vehicle Variants Fail',
  props<{ payload: any }>()
);
export const LoadVehicleVariantsSuccess = createAction(
  '[Customer] Load Vehicle Variants Success',
  props<{ payload: IVehicle.IVariants[] }>()
);

// Reset List
export const ResetList = createAction(
  '[Customer] Reset List',
  props<{ payload: string }>()
);

// Reset Vehicle Status
export const ResetVehicleStatus = createAction(
  '[Customer] Reset Vehicle Status',
  props<{ payload: Update<IVehicle.IDocument> }>()
);

// Reset Searched Vehicle Status
export const ResetSearchedVehicleStatus = createAction(
  '[Customer] Reset Searched Vehicle Status',
  props<{ payload: Update<IVehicle.IDocument> }>()
);

// Go To Vehicles List
export const GoToVehiclesList = createAction('[Customer] Go To Vehicles List');

// Search Vehicle By Number Plate
export const SearchVehicleByNumberPlate = createAction(
  '[Customer] Search Vehicle By Number Plate',
  props<{ payload: string }>()
);
export const SearchVehicleByNumberPlateFail = createAction(
  '[Customer] Search Vehicle By Number Plate Fail',
  props<{ payload: IError }>()
);
export const SearchVehicleByNumberPlateSuccess = createAction(
  '[Customer] Search Vehicle By Number Plate Success',
  props<{ payload: IVehicle.IDocument }>()
);

export const ResetVehicleItem = createAction('[Customer] Reset Vehicle Item');

// redirect
export const RedirectToVehicles = createAction(
  '[Customer] Redirect To Vehicles'
);

// Reset Selected Vehicle
export const ResetSelectedVehicle= createAction(
  '[Customer] Reset Selected Vehicle'
);

// Reset Searched Vehicle
export const ResetSearchedVehicle= createAction(
  '[Customer] Reset Searched Vehicle'
);

const all = union({
  SetVehiclesPage,
  FilterVehicles,
  SortVehicles,
  ResetFilterVehicles,
  ResetSortVehicles,
  LoadVehicles,
  LoadVehiclesFail,
  LoadVehiclesSuccess,
  UpdateVehicle,
  UpdateVehicleFail,
  UpdateVehicleSuccess,
  ActivateVehicle,
  ActivateVehicleFail,
  ActivateVehicleSuccess,
  DeactivateVehicle,
  DeactivateVehicleFail,
  DeactivateVehicleSuccess,
  GetVehicle,
  GetVehicleFail,
  GetVehicleSuccess,
  TyreWidths,
  TyreWidthsFail,
  TyreWidthsSuccess,
  TyreAspectRatios,
  TyreAspectRatiosFail,
  TyreAspectRatiosSuccess,
  TyreRims,
  TyreRimsFail,
  TyreRimsSuccess,
  RearTyreWidths,
  RearTyreWidthsFail,
  RearTyreWidthsSuccess,
  RearTyreAspectRatios,
  RearTyreAspectRatiosFail,
  RearTyreAspectRatiosSuccess,
  RearTyreRims,
  RearTyreRimsFail,
  RearTyreRimsSuccess,
  ResetTyre,
  LoadVehicleBrands,
  LoadVehicleBrandsFail,
  LoadVehicleBrandsSuccess,
  LoadVehicleModels,
  LoadVehicleModelsFail,
  LoadVehicleModelsSuccess,
  LoadVehicleVariants,
  LoadVehicleVariantsFail,
  LoadVehicleVariantsSuccess,
  ResetList,
  ResetVehicleStatus,
  ResetSearchedVehicleStatus,
  LoadVehiclesInspections,
  LoadVehiclesInspectionsFail,
  LoadVehiclesInspectionsSuccess,
  GoToVehiclesList,
  RedirectToVehicles,
  ResetSelectedVehicle,
  ResetSearchedVehicle,
  SearchVehicleByNumberPlate,
  SearchVehicleByNumberPlateFail,
  SearchVehicleByNumberPlateSuccess,
  ResetVehicleItem,
  UpdateSearchedVehicle,
  UpdateSearchedVehicleFail,
  UpdateSearchedVehicleSuccess,
});
export type VehiclesActionsUnion = typeof all;
