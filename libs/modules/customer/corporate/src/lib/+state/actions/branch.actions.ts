import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IBranches } from '../../models';

// Load Branches
export const LoadBranches = createAction(
  '[Customer] Load Branches',
  props<{ payload: string }>()
);
export const LoadBranchesFail = createAction(
  '[Customer] Load Branches Fail',
  props<{ payload: any }>()
);
export const LoadBranchesSuccess = createAction(
  '[Customer] Load Branches Success',
  props<{ payload: IBranches.IDocument[] }>()
);

// Get Branch
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

// Select Branche
export const SelectBranch = createAction(
  '[Customer] Select Branch',
  props<{ payload: IBranches.IDocument }>()
);

// Create Branch
export const CreateBranch = createAction(
  '[Customer] Create Branch',
  props<{ payload: IBranches.ICreate }>()
);
export const CreateBranchFail = createAction(
  '[Customer] Create Branch Fail',
  props<{ payload: any }>()
);
export const CreateBranchSuccess = createAction(
  '[Customer] Create Branch Success',
  props<{ payload: IBranches.IDocument }>()
);

// Update Branch
export const UpdateBranch = createAction(
  '[Customer] Update Branch',
  props<{ payload: IBranches.IDocument }>()
);
export const UpdateBranchFail = createAction(
  '[Customer] Update Branch Fail',
  props<{ payload: any }>()
);
export const UpdateBranchSuccess = createAction(
  '[Customer] Update Branch Success',
  props<{ payload: Update<IBranches.IDocument> }>()
);

// Activate Branch
export const ActivateBranch = createAction(
  '[Customer] Activate Branch',
  props<{ payload: IBranches.IDocument }>()
);
export const ActivateBranchFail = createAction(
  '[Customer] Activate Branch Fail',
  props<{ payload: any }>()
);
export const ActivateBranchSuccess = createAction(
  '[Customer] Activate Branch Success',
  props<{ payload: Update<IBranches.IDocument> }>()
);

// Deactivate Branch
export const DeactivateBranch = createAction(
  '[Customer] Deactivate Branch',
  props<{ payload: IBranches.IDocument }>()
);
export const DeactivateBranchFail = createAction(
  '[Customer] Deactivate Branch Fail',
  props<{ payload: any }>()
);
export const DeactivateBranchSuccess = createAction(
  '[Customer] Deactivate Branch Success',
  props<{ payload: Update<IBranches.IDocument> }>()
);

// Load Country Names
export const LoadCountryNames = createAction('[Customer] Load Country Names');
export const LoadCountryNamesFail = createAction(
  '[Customer] Load Country Names Fail',
  props<{ payload: any }>()
);
export const LoadCountryNamesSuccess = createAction(
  '[Customer] Load Country Names Success',
  props<{ payload: string[] }>()
);

// Get Country
export const GetCountry = createAction(
  '[Customer] Get Country',
  props<{ payload: string }>()
);
export const GetCountryFail = createAction(
  '[Customer] Get Country Fail',
  props<{ payload: any }>()
);
export const GetCountrySuccess = createAction(
  '[Customer] Get Country Success',
  props<{ payload: IBranches.IGetCountry }>()
);

// redirect
export const RedirectToCorporates = createAction(
  '[Customer] Redirect To Corporates'
);



// Create Schedular
export const CreateSchedular = createAction(
  '[Customer] Create Schedular',
  props<{ payload: IBranches.ISchedulesPayload }>()
);
export const CreateSchedularFail = createAction(
  '[Customer] Create Schedular Fail',
  props<{ payload: any }>()
);
export const CreateSchedularSuccess = createAction(
  '[Customer] Create Schedular Success',
  props<{ payload: IBranches.IDocument }>()
);



// Update Schedular
export const UpdateSchedular = createAction(
  '[Customer] Update Schedular',
  props<{ payload: IBranches.ISchedulesPayload }>()
);
export const UpdateSchedularFail = createAction(
  '[Customer] Update Schedular Fail',
  props<{ payload: any }>()
);
export const UpdateSchedularSuccess = createAction(
  '[Customer] Update Schedular Success',
  props<{ payload: IBranches.IDocument }>()
);

// Delete Schedular
export const DeleteSchedular = createAction(
  '[Customer] Delete Schedular',
  props<{ payload: IBranches.ISchedulesPayload }>()
);
export const DeleteSchedularFail = createAction(
  '[Customer] Delete Schedular Fail',
  props<{ payload: any }>()
);
export const DeleteSchedularSuccess = createAction(
  '[Customer] Delete Schedular Success',
  props<{ payload: IBranches.IDocument }>()
);



// Create Schedular Team
export const CreateSchedularTeam = createAction(
  '[Customer] Create Schedular Team',
  props<{ payload: IBranches.ITeamPayload }>()
);
export const CreateSchedularTeamFail = createAction(
  '[Customer] Create Schedular Team Fail',
  props<{ payload: any }>()
);
export const CreateSchedularTeamSuccess = createAction(
  '[Customer] Create Schedular Team Success',
  props<{ payload: IBranches.IDocument }>()
);



// Update Schedular
export const UpdateSchedularTeam = createAction(
  '[Customer] Update Schedular Team',
  props<{ payload: IBranches.ITeamPayload }>()
);
export const UpdateSchedularTeamFail = createAction(
  '[Customer] Update Schedular Team Fail',
  props<{ payload: any }>()
);
export const UpdateSchedularTeamSuccess = createAction(
  '[Customer] Update Schedular Team Success',
  props<{ payload: IBranches.IDocument }>()
);

// Delete Schedular Team
export const DeleteSchedularTeam = createAction(
  '[Customer] Delete Schedular Team',
  props<{ payload: IBranches.ITeamPayload }>()
);
export const DeleteSchedularTeamFail = createAction(
  '[Customer] Delete Schedular Team Fail',
  props<{ payload: any }>()
);
export const DeleteSchedularTeamSuccess = createAction(
  '[Customer] Delete Schedular Team Success',
  props<{ payload: IBranches.IDocument }>()
);

// Reset Branch
export const ResetBranch = createAction('[Customer] Reset Branch');

// Redirect Teams
export const RedirectToTeams = createAction('[Customer] RedirectToTeams Branch');
export const RedirectToOffDays = createAction('[Customer] RedirectToOffDays Branch');




// Create OffDays
export const CreateSchedulesOffDays = createAction(
  '[Customer] Create Schedules OffDays',
  props<{ payload: IBranches.IOffDaysPayload }>()
);
export const CreateSchedulesOffDaysFail = createAction(
  '[Customer] Create Schedules OffDays Fail',
  props<{ payload: any }>()
);
export const CreateSchedulesOffDaysSuccess = createAction(
  '[Customer] Create Schedules OffDays Success',
  props<{ payload: IBranches.IDocument }>()
);



// Update OffDays
export const UpdateSchedulesOffDays = createAction(
  '[Customer] Update Schedules Off Days',
  props<{ payload: IBranches.IOffDaysPayload }>()
);
export const UpdateSchedulesOffDaysFail = createAction(
  '[Customer] Update Schedules Off Days Fail',
  props<{ payload: any }>()
);
export const UpdateSchedulesOffDaysSuccess = createAction(
  '[Customer] Update Schedules Off Days Success',
  props<{ payload: IBranches.IDocument }>()
);

// Delete OffDays
export const DeleteSchedularOffDays = createAction(
  '[Customer] Delete Schedular Off Days',
  props<{ payload: IBranches.IOffDaysPayload }>()
);
export const DeleteSchedularOffDaysFail = createAction(
  '[Customer] Delete Schedular  Off Days Fail',
  props<{ payload: any }>()
);
export const DeleteSchedularOffDaysSuccess = createAction(
  '[Customer] Delete Schedular  Off Days Success',
  props<{ payload: IBranches.IDocument }>()
);

const all = union({
  SelectBranch,
  LoadBranches,
  LoadBranchesFail,
  LoadBranchesSuccess,
  CreateBranch,
  CreateBranchFail,
  CreateBranchSuccess,
  UpdateBranch,
  UpdateBranchFail,
  UpdateBranchSuccess,
  ActivateBranch,
  ActivateBranchFail,
  ActivateBranchSuccess,
  DeactivateBranch,
  DeactivateBranchFail,
  DeactivateBranchSuccess,
  LoadCountryNames,
  LoadCountryNamesFail,
  LoadCountryNamesSuccess,
  GetCountry,
  GetCountryFail,
  GetCountrySuccess,
  RedirectToCorporates,
  ResetBranch,
  GetBranch,
  GetBranchFail,
  GetBranchSuccess,
  CreateSchedular,
  CreateSchedularSuccess,
  CreateSchedularFail,
  UpdateSchedular,
  UpdateSchedularSuccess,
  UpdateSchedularFail,
  DeleteSchedular,
  DeleteSchedularSuccess,
  DeleteSchedularFail,
  CreateSchedularTeam,
  CreateSchedularTeamSuccess,
  CreateSchedularTeamFail,
  UpdateSchedularTeam,
  UpdateSchedularTeamSuccess,
  UpdateSchedularTeamFail,
  DeleteSchedularTeam,
  DeleteSchedularTeamSuccess,
  DeleteSchedularTeamFail,
  RedirectToTeams,
  CreateSchedulesOffDays,
  CreateSchedulesOffDaysFail,
  CreateSchedulesOffDaysSuccess,
  UpdateSchedulesOffDays,
  UpdateSchedulesOffDaysFail,
  UpdateSchedulesOffDaysSuccess,
  DeleteSchedularOffDays,
  DeleteSchedularOffDaysFail,
  DeleteSchedularOffDaysSuccess
});
export type BranchesActionsUnion = typeof all;
