import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { ICountry } from '../../models';

// Load Countries
export const LoadCountries = createAction('[Admin] Load Countries');
export const LoadCountriesFail = createAction(
  '[Admin] Load Countries Fail',
  props<{ payload: any }>()
);
export const LoadCountriesSuccess = createAction(
  '[Admin] Load Countries Success',
  props<{ payload: ICountry.IDocument[] }>()
);

// Create Country
export const CreateCountry = createAction(
  '[Admin] Create Countries',
  props<{ payload: ICountry.ICreate }>()
);
export const CreateCountryFail = createAction(
  '[Admin] Create Country Fail',
  props<{ payload: any }>()
);
export const CreateCountrySuccess = createAction(
  '[Admin] Create Country Success',
  props<{ payload: ICountry.IDocument }>()
);

// Update Country
export const UpdateCountry = createAction(
  '[Admin] Update Countries',
  props<{ payload: ICountry.IUpdate }>()
);
export const UpdateCountryFail = createAction(
  '[Admin] Update Country Fail',
  props<{ payload: any }>()
);
export const UpdateCountrySuccess = createAction(
  '[Admin] Update Country Success',
  props<{ payload: Update<ICountry.IDocument> }>()
);

// Activate Country
export const ActivateCountry = createAction(
  '[Admin] Activate Country',
  props<{ payload: ICountry.IDocument }>()
);
export const ActivateCountryFail = createAction(
  '[Admin] Activate Country Fail',
  props<{ payload: any }>()
);
export const ActivateCountrySuccess = createAction(
  '[Admin] Activate Country Success',
  props<{ payload: Update<ICountry.IDocument> }>()
);

// Deactivate Country
export const DeactivateCountry = createAction(
  '[Admin] Deactivate Country',
  props<{ payload: ICountry.IDocument }>()
);
export const DeactivateCountryFail = createAction(
  '[Admin] Deactivate Country Fail',
  props<{ payload: any }>()
);
export const DeactivateCountrySuccess = createAction(
  '[Admin] Deactivate Country Success',
  props<{ payload: Update<ICountry.IDocument> }>()
);

// Load Country Names
export const LoadCountryNames = createAction('[Admin] Load Country Names');
export const LoadCountryNamesFail = createAction(
  '[Admin] Load Country Names Fail',
  props<{ payload: any }>()
);
export const LoadCountryNamesSuccess = createAction(
  '[Admin] Load Country Names Success',
  props<{ payload: string[] }>()
);

// Get Country
export const GetCountry = createAction(
  '[Admin] Get Country',
  props<{ payload: string }>()
);
export const GetCountryFail = createAction(
  '[Admin] Get Country Fail',
  props<{ payload: any }>()
);
export const GetCountrySuccess = createAction(
  '[Admin] Get Country Success',
  props<{ payload: ICountry.IGetCountry }>()
);

// Reset Country Form
export const ResetCountryForm = createAction(
  '[Admin] Reset Country Form',
  props<{ payload: ICountry.IGetCountry }>()
);

// Reset Country Status
export const ResetCountryStatus = createAction(
  '[Admin] Reset Country Status',
  props<{ payload: Update<ICountry.IDocument> }>()
);

const all = union({
  LoadCountries,
  LoadCountriesFail,
  LoadCountriesSuccess,
  CreateCountry,
  CreateCountryFail,
  CreateCountrySuccess,
  UpdateCountry,
  UpdateCountryFail,
  UpdateCountrySuccess,
  ActivateCountry,
  ActivateCountryFail,
  ActivateCountrySuccess,
  DeactivateCountry,
  DeactivateCountryFail,
  DeactivateCountrySuccess,
  GetCountry,
  GetCountryFail,
  GetCountrySuccess,
  LoadCountryNames,
  LoadCountryNamesFail,
  LoadCountryNamesSuccess,
  ResetCountryForm,
  ResetCountryStatus
});
export type CountiesActionsUnion = typeof all;
