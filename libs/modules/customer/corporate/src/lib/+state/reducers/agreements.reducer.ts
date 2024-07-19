import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { AgreementsActions } from '../actions';

import { IAgreements } from '../../models';

export interface AgreementsState extends EntityState<IAgreements.IDocument> {
  corporateUuid: string;
  selectedAgreement: IAgreements.IDocument | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<
  IAgreements.IDocument
> = createEntityAdapter<IAgreements.IDocument>({
  selectId: app => app.uuid
});

export const initialState: AgreementsState = adapter.getInitialState({
  corporateUuid: null,
  selectedAgreement: null,
  loading: false,
  loaded: false,
  error: null
});

const agreementReducer = createReducer(
  initialState,

  on(AgreementsActions.SetCorporateAgreementsPage, (state, { payload }) => {
    const { corporateUuid } = payload;
    return adapter.removeAll({
      ...state,
      corporateUuid,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(AgreementsActions.LoadCorporateAgreements, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    AgreementsActions.LoadCorporateAgreementsFail,
    AgreementsActions.CreateCorporateAgreementFail,
    AgreementsActions.UpdateCorporateAgreementFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(AgreementsActions.LoadCorporateAgreementsSuccess, (state, { payload }) => {
    return adapter.addAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(
    AgreementsActions.CreateCorporateAgreement,
    AgreementsActions.UpdateCorporateAgreement,
    state => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(AgreementsActions.CreateCorporateAgreementSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(AgreementsActions.UpdateCorporateAgreementSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  )
);

export function reducer(
  state: AgreementsState | undefined,
  action: AgreementsActions.CorporateAgreementsActionsUnion
) {
  return agreementReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Agreements uuids
export const selectAgreementsUuids = selectIds;

// select the dictionary of Agreements entities
export const selectAgreementsEntities = selectEntities;

// select the array of Agreements
export const selectAllAgreements = selectAll;

// select the total Agreements count
export const selectAgreementsTotal = selectTotal;
