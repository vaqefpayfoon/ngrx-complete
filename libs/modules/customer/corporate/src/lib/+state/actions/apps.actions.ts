import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IApps } from '../../models';

// Set Corporate Apps Page
export const SetCorporateAppsPage = createAction(
  '[Customer] Set Corporate Apps Page',
  props<{ payload: IApps.IConfig }>()
);

// Load Corporate Apps
export const LoadCorporateApps = createAction('[Customer] Load Corporate Apps');
export const LoadCorporateAppsFail = createAction(
  '[Customer] Load Corporate Apps Fail',
  props<{ payload: any }>()
);
export const LoadCorporateAppsSuccess = createAction(
  '[Customer] Load Corporate Apps Success',
  props<{ payload: IApps.IDocument[] }>()
);

// Load Corporate App
export const LoadCorporateApp = createAction(
  '[Customer] Load Corporate App',
  props<{ payload: string }>()
);
export const LoadCorporateAppFail = createAction(
  '[Customer] Load Corporate App Fail',
  props<{ payload: any }>()
);
export const LoadCorporateAppSuccess = createAction(
  '[Customer] Load Corporate App Success',
  props<{ payload: IApps.IDocument }>()
);

// Create Corporate App
export const CreateCorporateApp = createAction(
  '[Customer] Create Corporate App',
  props<{ payload: IApps.ICreate }>()
);
export const CreateCorporateAppFail = createAction(
  '[Customer] Create Corporate App Fail',
  props<{ payload: any }>()
);
export const CreateCorporateAppSuccess = createAction(
  '[Customer] Create Corporate App Success',
  props<{ payload: { token: string; corporateApp: IApps.IDocument } }>()
);

// Regenerate Corporate App Token
export const RegenerateCorporateAppToken = createAction(
  '[Customer] Regenerate Corporate App Token',
  props<{ payload: IApps.IDocument }>()
);
export const RegenerateCorporateAppTokenFail = createAction(
  '[Customer] Create Corporate App Fail',
  props<{ payload: any }>()
);
export const RegenerateCorporateAppTokenSuccess = createAction(
  '[Customer] Regenerate Corporate App Token Success',
  props<{
    payload: {
      token: string;
      corporateApp: IApps.IDocument;
    };
  }>()
);

// Update Corporate App
export const UpdateCorporateApp = createAction(
  '[Customer] Update Corporate App',
  props<{ payload: IApps.IDocument }>()
);
export const UpdateCorporateAppFail = createAction(
  '[Customer] Update Corporate App Fail',
  props<{ payload: any }>()
);
export const UpdateCorporateAppSuccess = createAction(
  '[Customer] Update Corporate App Success',
  props<{ payload: Update<IApps.IDocument> }>()
);

// Activate Corporate App
export const ActivateCorporateApp = createAction(
  '[Customer] Activate Corporate App',
  props<{ payload: IApps.IDocument }>()
);
export const ActivateCorporateAppFail = createAction(
  '[Customer] Activate Corporate App Fail',
  props<{ payload: any }>()
);
export const ActivateCorporateAppSuccess = createAction(
  '[Customer] Activate Corporate App Success',
  props<{ payload: Update<IApps.IDocument> }>()
);

// Deactivate Corporate App
export const DeactivateCorporateApp = createAction(
  '[Customer] Deactivate Corporate App',
  props<{ payload: IApps.IDocument }>()
);
export const DeactivateCorporateAppFail = createAction(
  '[Customer] Deactivate Corporate App Fail',
  props<{ payload: any }>()
);
export const DeactivateCorporateAppSuccess = createAction(
  '[Customer] Deactivate Corporate App Success',
  props<{ payload: Update<IApps.IDocument> }>()
);

// Reset Corporate App Status
export const ResetCorporateAppStatus = createAction(
  '[Customer] Reset Corporate App Status',
  props<{ payload: Update<IApps.IDocument> }>()
);

// Reset Corporate App Token
export const ResetCorporateAppToken = createAction(
  '[Customer] Reset Corporate App Token'
);

// Reset Selected App
export const ResetSelectedApp = createAction(
  '[Customer] Reset Selected App'
);

// redirect
export const RedirectToCorporates = createAction(
  '[Customer] Redirect To Corporates'
);

const all = union({
  SetCorporateAppsPage,
  LoadCorporateApps,
  LoadCorporateAppsFail,
  LoadCorporateAppsSuccess,
  LoadCorporateApp,
  LoadCorporateAppFail,
  LoadCorporateAppSuccess,
  CreateCorporateApp,
  CreateCorporateAppFail,
  CreateCorporateAppSuccess,
  UpdateCorporateApp,
  UpdateCorporateAppFail,
  UpdateCorporateAppSuccess,
  ActivateCorporateApp,
  ActivateCorporateAppFail,
  ActivateCorporateAppSuccess,
  DeactivateCorporateApp,
  DeactivateCorporateAppFail,
  DeactivateCorporateAppSuccess,
  RegenerateCorporateAppToken,
  RegenerateCorporateAppTokenSuccess,
  RegenerateCorporateAppTokenFail,
  ResetCorporateAppStatus,
  ResetCorporateAppToken,
  ResetSelectedApp,
  RedirectToCorporates
});
export type CorporateAppsActionsUnion = typeof all;
