import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAgreements from '../reducers/agreements.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IAgreements } from '../../models';

export const getAgreementsState = createSelector(
  fromFeature.getCorporateState,
  (state: fromFeature.ICorporateState) => state.agreements
);

export const getAgreementsEntities = createSelector(
  getAgreementsState,
  fromAgreements.selectAgreementsEntities
);

export const getAllAgreements = createSelector(
  getAgreementsState,
  fromAgreements.selectAllAgreements
);

export const getSelectedAgreement = createSelector(
  getAgreementsEntities,
  fromRoot.getRouterState,
  (entities, router): IAgreements.IDocument => {
    return entities && router
      ? router.state && entities[router.state.params.uuid]
      : null;
  }
);

export const getCorporateAgreementsConfig = createSelector(
  getAgreementsState,
  (state: fromAgreements.AgreementsState) => {
    const { corporateUuid } = state;
    return {
      corporateUuid
    };
  }
);

export const getAgreementsTotals = createSelector(
  getAgreementsState,
  fromAgreements.selectAgreementsTotal
);

export const getAgreementsLoaded = createSelector(
  getAgreementsState,
  (state: fromAgreements.AgreementsState) => state.loaded
);

export const getAgreementsLoading = createSelector(
  getAgreementsState,
  (state: fromAgreements.AgreementsState) => state.loading
);

export const getAgreementsError = createSelector(
  getAgreementsState,
  (state: fromAgreements.AgreementsState) => state.error
);

export const AgreementsQuery = {
  getAgreementsState,
  getAgreementsEntities,
  getAllAgreements,
  getSelectedAgreement,
  getCorporateAgreementsConfig,
  getAgreementsTotals,
  getAgreementsLoaded,
  getAgreementsLoading,
  getAgreementsError
};
