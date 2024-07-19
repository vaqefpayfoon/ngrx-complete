import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { IError } from '@neural/shared/data';
import { Update } from '@ngrx/entity';
import { createAction, props, union } from '@ngrx/store';
import { IServiceLine } from '../../models';

export const loadServiceLines = createAction('[Hub list] Get ServiceLines');
export const loadServiceLinesSuccess = createAction(
  '[Hub list] Get ServiceLines success',
  props<{
    serviceLines: IServiceLine.IDocument[];
    pagination: IServiceLine.IPagination;
  }>()
);
export const loadServiceLinesFailed = createAction(
  '[Hub list] Get ServiceLines failed',
  props<{ payload: IError }>()
);
export const SetServiceLinePage = createAction(
  '[Hub] Set ServiceLine Page',
  props<{ payload: IServiceLine.IConfig }>()
);
export const ChangeServiceLinePage = createAction(
  '[Hub] Change ServiceLine Page',
  props<{ payload: IServiceLine.IConfig }>()
);
export const SetServiceLineFilters = createAction(
  '[Hub] Set ServiceLine Filters',
  props<{ payload: IServiceLine.IFilter }>()
);
export const GetServiceLine = createAction(
  '[Hub] Get ServiceLine',
  props<{ payload: string }>()
);
export const GetServiceLineFail = createAction(
  '[Hub] Get ServiceLine Fail',
  props<{ payload: IError }>()
);
export const GetServiceLineSuccess = createAction(
  '[Hub] Get ServiceLine Success',
  props<{ payload: IServiceLine.IDocument }>()
);
export const CreateServiceLine = createAction(
  '[Hub] Create ServiceLine',
  props<{ payload: IServiceLine.IDocument }>()
);
export const CreateServiceLineFail = createAction(
  '[Hub] Create ServiceLine Fail',
  props<{ payload: any }>()
);
export const CreateServiceLineSuccess = createAction(
  '[Hub] Create ServiceLine Success',
  props<{ payload: IServiceLine.IDocument }>()
);
export const UpdateServiceLine = createAction(
  '[Hub] Update ServiceLine',
  props<{
    payload: IServiceLine.IDocument;
  }>()
);
export const UpdateServiceLineFail = createAction(
  '[Hub] Update ServiceLine Fail',
  props<{ payload: any }>()
);
export const UpdateServiceLineSuccess = createAction(
  '[Hub] Update ServiceLine Success',
  props<{ payload: Update<IServiceLine.IDocument> }>()
);
export const RedirectToServiceLine = createAction(
  '[Hub] Redirect To ServiceLine'
);

export const GetBrands = createAction('[Admin] Get PackagesBrands');
export const GetBrandsFail = createAction(
  '[Admin] Get PackagesBrands Fail',
  props<{ payload: IError }>()
);
export const GetBrandsSuccess = createAction(
  '[Admin] Get PackagesBrands Success',
  props<{ payload: IServiceLine.IBrand[] }>()
);

export const GetServiceTypes = createAction('[Admin] Get GetServiceTypes');
export const GetServiceTypesFail = createAction(
  '[Admin] Get GetServiceTypes Fail',
  props<{ payload: any }>()
);
export const GetServiceTypesSuccess = createAction(
  '[Admin] Get GetServiceTypes Success',
  props<{ payload: IServiceLine.IServiceType }>()
);

export const LoadCorporate = createAction(
  '[Customer] Load Corporate In Service Line'
);
export const LoadCorporateFail = createAction(
  '[Customer] Load Corporate In Service Line Fail',
  props<{ payload: any }>()
);
export const LoadCorporateSuccess = createAction(
  '[Customer] Load Corporate In Service Line Success',
  props<{ payload: ICorporates.IDocument }>()
);
export const ResetStatus = createAction(
  '[Admin] Reset ServiceLine Status',
  props<{ payload: Update<IServiceLine.IDocument> }>()
);
export const GetBranch = createAction(
  '[Customer] Get Branch',
  props<{ payload: string }>()
);
export const GetBranchFail = createAction(
  '[Customer] Get Branch Fail',
  props<{ payload: any }>()
);
export const GetBranchSuccess = createAction(
  '[Customer] Get Branch Success',
  props<{ payload: IBranches.IDocument }>()
);

export const ChangeStatusServiceLine = createAction(
  '[Hub] ChangeStatus ServiceLine',
  props<{
    payload: IServiceLine.IChangeStatus;
  }>()
);
export const ChangeStatusServiceLineFail = createAction(
  '[Hub] ChangeStatus ServiceLine Fail',
  props<{ payload: any }>()
);
export const ChangeStatusServiceLineSuccess = createAction(
  '[Hub] ChangeStatus ServiceLine Success',
  props<{ payload: Update<IServiceLine.IDocument> }>()
);

//Synch Service Line DMS
export const SyncServiceLineDMS = createAction(
  '[Hub] Sync Service Line DMS'
);
export const SyncServiceLineDMSFail = createAction(
  '[Hub] Sync Service Line DMS Fail',
  props<{ payload: any }>()
);
export const SyncServiceLineDMSSuccess = createAction(
  '[Hub] Sync Service Line DMS Success',
  props<{ payload: string }>()
);

export const GetFortellis = createAction(
  '[Hub] Get Fortellis',
  props<{ payload: IServiceLine.IParams}>()
);
export const GetFortellisFail = createAction(
  '[Hub] Get Fortellis Fail',
  props<{ payload: any }>()
);
export const GetFortellisSuccess = createAction(
  '[Hub] Get Fortellis Success',
  props<{ payload: IServiceLine.IFortellis }>()
);

const all = union({
  loadServiceLines,
  loadServiceLinesSuccess,
  loadServiceLinesFailed,
  SetServiceLinePage,
  ChangeServiceLinePage,
  SetServiceLineFilters,
  GetServiceLine,
  GetServiceLineSuccess,
  GetServiceLineFail,
  CreateServiceLine,
  CreateServiceLineSuccess,
  CreateServiceLineFail,
  UpdateServiceLine,
  UpdateServiceLineFail,
  UpdateServiceLineSuccess,
  RedirectToServiceLine,
  GetBrands,
  GetBrandsSuccess,
  GetBrandsFail,
  GetServiceTypes,
  GetServiceTypesSuccess,
  GetServiceTypesFail,
  LoadCorporate,
  LoadCorporateSuccess,
  LoadCorporateFail,
  GetBranch,
  GetBranchSuccess,
  GetBranchFail,
  ChangeStatusServiceLine,
  ChangeStatusServiceLineSuccess,
  ChangeStatusServiceLineFail,
  SyncServiceLineDMS,
  SyncServiceLineDMSFail,
  SyncServiceLineDMSSuccess,
  GetFortellis,
  GetFortellisSuccess,
  GetFortellisFail
});
export type ServiceLineActionsUnion = typeof all;
