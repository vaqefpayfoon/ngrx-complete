import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromProductReferences from './product-references.reducer';
import * as fromProductCoverages from './product-coverages.reducer';

export interface IMarketplacesState {
  readonly productReferences: fromProductReferences.ReferencesState;
  readonly productCoverages: fromProductCoverages.CoveragesState;
}

export const REDUCERS: ActionReducerMap<IMarketplacesState> = {
    productReferences: fromProductReferences.reducer,
    productCoverages: fromProductCoverages.reducer,
};

export const getMarketplacesState = createFeatureSelector<IMarketplacesState>(
  'marketplaces'
);
