import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IFleet } from '../../models';

// Set Fleets Page
export const SetFleetsPage = createAction(
  '[Customer] Set Fleets Page',
  props<{ payload: { config: IFleet.IConfig, branchUuid: string} }>()
);

// Load Fleets
export const LoadFleets = createAction('[Customer] Load Fleets');
export const LoadFleetsFail = createAction(
  '[Customer] Load Fleets Fail',
  props<{ payload: any }>()
);
export const LoadFleetsSuccess = createAction(
  '[Customer] Load Fleets Success',
  props<{
    fleets: IFleet.IDocument[];
    pagination: IFleet.IPagination;
  }>()
);

// Create Fleet
export const CreateFleet = createAction(
  '[Customer] Create Fleet',
  props<{ payload: IFleet.ICreate }>()
);
export const CreateFleetFail = createAction(
  '[Customer] Create Fleet Fail',
  props<{ payload: any }>()
);
export const CreateFleetSuccess = createAction(
  '[Customer] Create Fleet Success',
  props<{ payload: IFleet.IDocument }>()
);

// Get Fleet
export const GetFleet = createAction(
  '[Customer] Get Fleet',
  props<{ payload: string }>()
);
export const GetFleetFail = createAction(
  '[Customer] Get Fleet Fail',
  props<{ payload: any }>()
);
export const GetFleetSuccess = createAction(
  '[Customer] Get Fleet Success',
  props<{ payload: IFleet.IDocument }>()
);

// Update Fleet
export const UpdateFleet = createAction(
  '[Customer] Update Fleet',
  props<{ payload: IFleet.IDocument }>()
);
export const UpdateFleetFail = createAction(
  '[Customer] Update Fleet Fail',
  props<{ payload: any }>()
);
export const UpdateFleetSuccess = createAction(
  '[Customer] Update Fleet Success',
  props<{ payload: Update<IFleet.IDocument> }>()
);

// Activate Fleet
export const ActivateFleet = createAction(
  '[Customer] Activate Fleet',
  props<{ payload: IFleet.IDocument }>()
);
export const ActivateFleetFail = createAction(
  '[Customer] Activate Fleet Fail',
  props<{ payload: any }>()
);
export const ActivateFleetSuccess = createAction(
  '[Customer] Activate Fleet Success',
  props<{ payload: Update<IFleet.IDocument> }>()
);

// Deactivate Fleet
export const DeactivateFleet = createAction(
  '[Customer] Deactivate Fleet',
  props<{ payload: IFleet.IDocument }>()
);
export const DeactivateFleetFail = createAction(
  '[Customer] Deactivate Fleet Fail',
  props<{ payload: any }>()
);
export const DeactivateFleetSuccess = createAction(
  '[Customer] Deactivate Fleet Success',
  props<{ payload: Update<IFleet.IDocument> }>()
);

// Reset Fleet Status
export const ResetFleetStatus = createAction(
  '[Customer] Reset Fleet Status',
  props<{ payload: Update<IFleet.IDocument> }>()
);

// Reset Selected Fleet
export const ResetSelectedFleet = createAction(
  '[Customer] Reset Selected Fleet'
);

// Branch Change
export const GoToFleetsList = createAction(
  '[Customer] Go To Fleets List'
);

// redirect
export const RedirectToFleets = createAction(
  '[Configuration] Redirect To Fleets'
);

const all = union({
  SetFleetsPage,
  LoadFleets,
  LoadFleetsFail,
  LoadFleetsSuccess,
  CreateFleet,
  CreateFleetFail,
  CreateFleetSuccess,
  GetFleet,
  GetFleetFail,
  GetFleetSuccess,
  UpdateFleet,
  UpdateFleetFail,
  UpdateFleetSuccess,
  ActivateFleet,
  ActivateFleetFail,
  ActivateFleetSuccess,
  DeactivateFleet,
  DeactivateFleetFail,
  DeactivateFleetSuccess,
  ResetFleetStatus,
  ResetSelectedFleet,
  GoToFleetsList,
  RedirectToFleets
});
export type FleetsActionsUnion = typeof all;
