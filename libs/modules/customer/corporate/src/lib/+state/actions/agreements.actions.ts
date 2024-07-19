import { createAction, props, union } from '@ngrx/store';

// Entity
import { Update } from '@ngrx/entity';

// Models
import { IAgreements } from '../../models';

// Set Corporate Agreements Page
export const SetCorporateAgreementsPage = createAction(
  '[Customer] Set Corporate Agreements Page',
  props<{ payload: IAgreements.IConfig }>()
);

// Load Corporate Agreements
export const LoadCorporateAgreements = createAction(
  '[Customer] Load Corporate Agreements'
);
export const LoadCorporateAgreementsFail = createAction(
  '[Customer] Load Corporate Agreements Fail',
  props<{ payload: any }>()
);
export const LoadCorporateAgreementsSuccess = createAction(
  '[Customer] Load Corporate Agreements Success',
  props<{ payload: IAgreements.IDocument[] }>()
);

// Create Corporate Agreement
export const CreateCorporateAgreement = createAction(
  '[Customer] Create Corporate Agreement',
  props<{ payload: IAgreements.ICreate }>()
);
export const CreateCorporateAgreementFail = createAction(
  '[Customer] Create Corporate Agreement Fail',
  props<{ payload: any }>()
);
export const CreateCorporateAgreementSuccess = createAction(
  '[Customer] Create Corporate Agreement Success',
  props<{ payload: IAgreements.IDocument }>()
);

// Update Corporate Agreement
export const UpdateCorporateAgreement = createAction(
  '[Customer] Update Corporate Agreement',
  props<{ payload: IAgreements.IDocument }>()
);
export const UpdateCorporateAgreementFail = createAction(
  '[Customer] Update Corporate Agreement Fail',
  props<{ payload: any }>()
);
export const UpdateCorporateAgreementSuccess = createAction(
  '[Customer] Update Corporate Agreement Success',
  props<{ payload: Update<IAgreements.IDocument> }>()
);

const all = union({
  SetCorporateAgreementsPage,
  LoadCorporateAgreements,
  LoadCorporateAgreementsFail,
  LoadCorporateAgreementsSuccess,
  CreateCorporateAgreement,
  CreateCorporateAgreementFail,
  CreateCorporateAgreementSuccess,
  UpdateCorporateAgreement,
  UpdateCorporateAgreementFail,
  UpdateCorporateAgreementSuccess
});
export type CorporateAgreementsActionsUnion = typeof all;
