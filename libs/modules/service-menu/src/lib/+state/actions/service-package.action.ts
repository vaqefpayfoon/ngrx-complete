import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { IError } from '@neural/shared/data';
import { Update } from '@ngrx/entity';
import { createAction, props, union } from '@ngrx/store';
import { IServicePackage, IServiceLine } from '../../models';

export const loadServicePackages = createAction('[Hub list] Get ServicePackages');

export const loadServicePackagesSuccess = createAction(
  '[Hub list] Get ServicePackages success',
  props<{
    servicePackages: IServicePackage.IDocument[];
    pagination: IServiceLine.IPagination;
  }>()
);

export const loadServicePackagesFailed = createAction(
  '[Hub list] Get ServicePackages failed',
  props<{ payload: IError }>()
);

export const loadServiceLines = createAction('[Hub list] Get ServiceLinePackages');

export const loadServiceLinesSuccess = createAction(
  '[Hub list] Get ServiceLinePackages success',
  props<{
    payload: IServiceLine.IDocument[]
  }>()
);

export const loadServiceLinesFailed = createAction(
  '[Hub list] Get ServiceLinePackages failed',
  props<{ payload: IError }>()
);

export const SetServicePackagePage = createAction(
  '[Hub] Set ServicePackage Page',
  props<{ payload: IServiceLine.IConfig }>()
);

export const ChangeServicePackagePage = createAction(
  '[Hub] Change ServicePackage Page',
  props<{ payload: IServiceLine.IConfig }>()
);

export const SetServicePackageFilters = createAction(
  '[Hub] Set ServicePackage Filters',
  props<{ payload: IServiceLine.IFilter }>()
);

export const GetServicePackage = createAction(
  '[Hub] Get ServicePackage',
  props<{ payload: string }>()
);

export const GetServicePackageFail = createAction(
  '[Hub] Get ServicePackage Fail',
  props<{ payload: IError }>()
);

export const GetServicePackageSuccess = createAction(
  '[Hub] Get ServicePackage Success',
  props<{ payload: IServicePackage.IDocument }>()
);

export const CreateServicePackage = createAction(
  '[Hub] Create ServicePackage',
  props<{ payload: IServicePackage.IDocument }>()
);

export const CreateServicePackageFail = createAction(
  '[Hub] Create ServicePackage Fail',
  props<{ payload: any }>()
);

export const CreateServicePackageSuccess = createAction(
  '[Hub] Create ServicePackage Success',
  props<{ payload: IServicePackage.IDocument }>()
);

export const UpdateServicePackage = createAction(
  '[Hub] Update ServicePackage',
  props<{
    payload: IServicePackage.IDocument;
  }>()
);

export const UpdateServicePackageFail = createAction(
  '[Hub] Update ServicePackage Fail',
  props<{ payload: any }>()
);

export const UpdateServicePackageSuccess = createAction(
  '[Hub] Update ServicePackage Success',
  props<{ payload: Update<IServicePackage.IDocument> }>()
);

export const RedirectToServicePackage = createAction(
  '[Hub] Redirect To ServicePackage'
);

export const GetBrands = createAction('[Admin] Get Brands ServicePackage');

export const GetBrandsFail = createAction(
  '[Admin] Get Brands ServicePackage Fail',
  props<{ payload: IError }>()
);

export const GetBrandsSuccess = createAction(
  '[Admin] Get Brands ServicePackage Success',
  props<{ payload: IServiceLine.IBrand[] }>()
);


export const LoadCorporate = createAction(
  '[Customer] Load Corporate In ServicePackage'
);

export const LoadCorporateFail = createAction(
  '[Customer] Load Corporate In ServicePackage Fail',
  props<{ payload: any }>()
);

export const LoadCorporateSuccess = createAction(
  '[Customer] Load Corporate In ServicePackage Success',
  props<{ payload: ICorporates.IDocument }>()
);

export const ResetStatus = createAction(
  '[Admin] Reset ServicePackage Status',
  props<{ payload: Update<IServicePackage.IDocument> }>()
);

export const GetBranch = createAction(
  '[Customer] Get Branch ServicePackage',
  props<{ payload: string }>()
);

export const GetBranchFail = createAction(
  '[Customer] Get Branch ServicePackage Fail',
  props<{ payload: any }>()
);

export const GetBranchSuccess = createAction(
  '[Customer] Get Branch ServicePackage Success',
  props<{ payload: IBranches.IDocument }>()
);

export const ChangeStatusServicePackage = createAction(
  '[Hub] ChangeStatus ServicePackage',
  props<{
    payload: IServiceLine.IChangeStatus;
  }>()
);

export const ChangeStatusServicePackageFail = createAction(
  '[Hub] ChangeStatus ServicePackage Fail',
  props<{ payload: any }>()
);

export const ChangeStatusServicePackageSuccess = createAction(
  '[Hub] ChangeStatus ServicePackage Success',
  props<{ payload: Update<IServicePackage.IDocument> }>()
);


const all = union({
  loadServicePackages,
  loadServicePackagesSuccess,
  loadServicePackagesFailed,
  SetServicePackagePage,
  ChangeServicePackagePage,
  SetServicePackageFilters,
  GetServicePackage,
  GetServicePackageSuccess,
  GetServicePackageFail,
  CreateServicePackage,
  CreateServicePackageSuccess,
  CreateServicePackageFail,
  UpdateServicePackage,
  UpdateServicePackageSuccess,
  UpdateServicePackageFail,
  RedirectToServicePackage,
  GetBrands,
  GetBrandsSuccess,
  GetBrandsFail,
  ResetStatus,
  LoadCorporate,
  LoadCorporateSuccess,
  LoadCorporateFail,
  GetBranch,
  GetBranchSuccess,
  GetBranchFail,
  ChangeStatusServicePackage,
  ChangeStatusServicePackageSuccess,
  ChangeStatusServicePackageFail,
  loadServiceLines,
  loadServiceLinesSuccess,
  loadServiceLinesFailed
});

export type ServicePackageActionsUnion = typeof all;
