import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Insurer
import { IInsurer } from '../../models';

import {
  IGlobalPagination,
  IGlobalFilter,
  IGlobalConfig,
  IError,
  IRequest,
  IBody,
} from '@neural/shared/data';

// Set Insurers Page
export const SetInsurersPage = createAction(
  '[Admin] Set Insurers Page',
  props<IRequest<IGlobalConfig>>()
);

// Change Insurers Page
export const ChangeInsurersPage = createAction(
  '[Admin] Change Insurers Page',
  props<IRequest<IGlobalFilter>>()
);

// Set Insurers Filters
export const SetInsurersFilters = createAction(
  '[Admin] Set Insurers Filters',
  props<IRequest<IGlobalFilter>>()
);

// Load Insurers
export const LoadInsurers = createAction('[Admin] Load Insurers');
export const LoadInsurersFail = createAction(
  '[Admin] Load Insurers Fail',
  props<IRequest<IError>>()
);
export const LoadInsurersSuccess = createAction(
  '[Admin] Load Insurers Success',
  props<{
    insurers: IInsurer.IDocument[];
    pagination: IGlobalPagination;
  }>()
);

// Create Insurer
export const CreateInsurer = createAction(
  '[Admin] Create Insurer',
  props<IRequest<IInsurer.ICreate>>()
);
export const CreateInsurerFail = createAction(
  '[Admin] Create Insurer Fail',
  props<IRequest<IError>>()
);
export const CreateInsurerSuccess = createAction(
  '[Admin] Create Insurer Success',
  props<IRequest<IInsurer.IDocument>>()
);

// Update Insurer
export const UpdateInsurer = createAction(
  '[Admin] Update Insurer',
  props<IBody<IInsurer.IDocument, IInsurer.IUpdate>>()
);
export const UpdateInsurerFail = createAction(
  '[Admin] Update Insurer Fail',
  props<IRequest<IError>>()
);
export const UpdateInsurerSuccess = createAction(
  '[Admin] Update Insurer Success',
  props<IRequest<Update<IInsurer.IDocument>>>()
);

// Activate Insurers
export const ActivateInsurer = createAction(
  '[Admin] Activate Insurer',
  props<IRequest<IInsurer.IDocument>>()
);
export const ActivateInsurerFail = createAction(
  '[Admin] Activate Insurer Fail',
  props<IRequest<IError>>()
);
export const ActivateInsurersSuccess = createAction(
  '[Admin] Activate Insurer Success',
  props<IRequest<Update<IInsurer.IDocument>>>()
);

// Deactivate Insurers
export const DeactivateInsurer = createAction(
  '[Admin] Deactivate Insurer',
  props<IRequest<IInsurer.IDocument>>()
);
export const DeactivateInsurerFail = createAction(
  '[Admin] Deactivate Insurer Fail',
  props<IRequest<IError>>()
);
export const DeactivateInsurerSuccess = createAction(
  '[Admin] Deactivate Insurer Success',
  props<IRequest<Update<IInsurer.IDocument>>>()
);

// Delete Insurers
export const DeleteInsurer = createAction(
  '[Admin] Delete Insurer',
  props<IRequest<IInsurer.IDocument>>()
);
export const DeleteInsurerFail = createAction(
  '[Admin] Delete Insurer Fail',
  props<IRequest<IError>>()
);
export const DeleteInsurerSuccess = createAction(
  '[Admin] Delete Insurer Success',
  props<IRequest<IInsurer.IDocument>>()
);

// Get Insurer
export const GetInsurer = createAction(
  '[Admin] Get Insurer',
  props<IRequest<string>>()
);
export const GetInsurerFail = createAction(
  '[Admin] Get Insurer Fail',
  props<IRequest<IError>>()
);
export const GetInsurerSuccess = createAction(
  '[Admin] Get Insurer Success',
  props<IRequest<IInsurer.IDocument>>()
);

// Reset Insurer Status
export const ResetInsurerStatus = createAction(
  '[Admin] Reset Insurer Status',
  props<IRequest<Update<IInsurer.IDocument>>>()
);

// Reset Selected Insurer
export const ResetSelectedInsurer = createAction(
  '[Admin] Reset Selected Insurer'
);

// Reset Insurer
export const ResetInsurer = createAction(
  '[Admin] Reset Insurer'
);

// redirect
export const RedirectToInsurers = createAction(
  '[Configuration] Redirect To Insurers',
  props<IRequest<Partial<IInsurer.IDocument>>>()
);

const all = union({
  SetInsurersPage,
  ChangeInsurersPage,
  SetInsurersFilters,
  LoadInsurers,
  LoadInsurersFail,
  LoadInsurersSuccess,
  CreateInsurer,
  CreateInsurerFail,
  CreateInsurerSuccess,
  UpdateInsurer,
  UpdateInsurerFail,
  UpdateInsurerSuccess,
  ActivateInsurer,
  ActivateInsurerFail,
  ActivateInsurersSuccess,
  DeactivateInsurer,
  DeactivateInsurerFail,
  DeactivateInsurerSuccess,
  GetInsurer,
  GetInsurerFail,
  GetInsurerSuccess,
  DeleteInsurer,
  DeleteInsurerFail,
  DeleteInsurerSuccess,
  ResetInsurerStatus,
  ResetSelectedInsurer,
  RedirectToInsurers,
  ResetInsurer,
});
export type InsurersActionsUnion = typeof all;
