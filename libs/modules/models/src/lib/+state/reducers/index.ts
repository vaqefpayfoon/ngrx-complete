import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCarModels from './car-models.reducer';

export interface IModelsState {
  readonly carModels: fromCarModels.ModelsState;
}

export const REDUCERS: ActionReducerMap<IModelsState> = {
  carModels: fromCarModels.reducer
};

export const getCarModelsState = createFeatureSelector<IModelsState>('models');
