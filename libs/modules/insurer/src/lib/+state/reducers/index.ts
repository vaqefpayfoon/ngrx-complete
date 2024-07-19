import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { InsurerActions } from '../actions';

import * as fromInsurer from './insurer.reducer';

export interface IInsurerModel {
  readonly insurers: fromInsurer.InsurersState;
}

export const REDUCERS: ActionReducerMap<
  IInsurerModel,
  InsurerActions.InsurersActionsUnion
> = {
  insurers: fromInsurer.reducer,
};

export const getInsuranceState = createFeatureSelector<IInsurerModel>(
  'insurance'
);
