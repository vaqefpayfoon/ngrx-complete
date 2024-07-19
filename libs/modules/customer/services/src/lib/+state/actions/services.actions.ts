import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IServices } from '../../models';

// Select Branch
export const SelectBranch = createAction('[Customer] Select Branch');

// Select Category
export const SelectCategory = createAction(
  '[Customer] Select Category',
  props<{ payload: any }>()
);

// Load Services
export const LoadServices = createAction('[Customer] Load Services');
export const LoadServicesFail = createAction(
  '[Customer] Load Services Fail',
  props<{ payload: any }>()
);
export const LoadServicesSuccess = createAction(
  '[Customer] Load Services Success',
  props<{ payload: IServices.IDocument[] }>()
);

// Activate Service
export const ActivateService = createAction(
  '[Customer] Activate Service',
  props<{ payload: IServices.IDocument }>()
);
export const ActivateServiceFail = createAction(
  '[Customer] Activate Service Fail',
  props<{ payload: any }>()
);
export const ActivateServiceSuccess = createAction(
  '[Customer] Activate Service Success',
  props<{ payload: Update<IServices.IDocument> }>()
);

// Deactivate Service
export const DeactivateService = createAction(
  '[Customer] Deactivate Service',
  props<{ payload: IServices.IDocument }>()
);
export const DeactivateServiceFail = createAction(
  '[Customer] Deactivate Service Fail',
  props<{ payload: any }>()
);
export const DeactivateServiceSuccess = createAction(
  '[Customer] Deactivate Service Success',
  props<{ payload: Update<IServices.IDocument> }>()
);

// Reset Service Status
export const ResetServiceStatus = createAction(
  '[Customer] Reset Service Status',
  props<{ payload: Update<IServices.IDocument> }>()
);

// Create Service
export const CreateService = createAction(
  '[Customer] Create Service',
  props<{ payload: IServices.ICreate }>()
);
export const CreateServiceFail = createAction(
  '[Customer] Create Service Fail',
  props<{ payload: any }>()
);
export const CreateServiceSuccess = createAction(
  '[Customer] Create Service Success',
  props<{ payload: IServices.IDocument }>()
);

// Get Service
export const GetService = createAction(
  '[Customer] Get Service',
  props<{ payload: string }>()
);
export const GetServiceFail = createAction(
  '[Customer] Get Service Fail',
  props<{ payload: any }>()
);
export const GetServiceSuccess = createAction(
  '[Customer] Get Service Success',
  props<{ payload: IServices.IDocument }>()
);

// Update Service
export const UpdateService = createAction(
  '[Customer] Update Service',
  props<{ payload: IServices.IDocument }>()
);
export const UpdateServiceFail = createAction(
  '[Customer] Update Service Fail',
  props<{ payload: any }>()
);
export const UpdateServiceSuccess = createAction(
  '[Customer] Update Service Success',
  props<{ payload: Update<IServices.IDocument> }>()
);

// Branch Change
export const GoToServicesList = createAction(
  '[Customer] Go To Services List'
);

// Reset Selected Service
export const ResetSelectedService = createAction(
  '[Customer] Reset Selected Service'
);

// redirect
export const RedirectToServices = createAction(
  '[Configuration] Redirect To Services'
);

const all = union({
  LoadServices,
  LoadServicesFail,
  LoadServicesSuccess,
  ActivateService,
  ActivateServiceFail,
  ActivateServiceSuccess,
  DeactivateService,
  DeactivateServiceFail,
  DeactivateServiceSuccess,
  ResetServiceStatus,
  ResetSelectedService,
  CreateService,
  CreateServiceFail,
  CreateServiceSuccess,
  GetService,
  GetServiceFail,
  GetServiceSuccess,
  UpdateService,
  UpdateServiceFail,
  UpdateServiceSuccess,
  SelectCategory,
  GoToServicesList,
  RedirectToServices
});
export type ServicesActionsUnion = typeof all;
