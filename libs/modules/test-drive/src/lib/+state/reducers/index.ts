import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromTestDrives from './test-drives.reducer';

export interface ITestDrivesState {
  readonly testDrives: fromTestDrives.TestDrivesState;
}

export const REDUCERS: ActionReducerMap<ITestDrivesState> = {
  testDrives: fromTestDrives.reducer,
};

export const getTestDrivesModuleState = createFeatureSelector<ITestDrivesState>(
  'testDrivesModule'
);
