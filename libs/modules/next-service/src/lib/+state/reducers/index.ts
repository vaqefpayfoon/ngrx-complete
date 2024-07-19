import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { INextService } from '../../models';

import * as fromNextService from './next-service.reducer';

export interface INextServiceStateFeature {
  readonly nextservices: fromNextService.INextServiceState;
}

export const REDUCERS: ActionReducerMap<INextServiceStateFeature> = {
  nextservices: fromNextService.reducer,
};

export const getNextServiceModuleState = createFeatureSelector<INextServiceStateFeature>('nextservices');