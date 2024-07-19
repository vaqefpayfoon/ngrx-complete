import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromVehicles from './vehicles.reducer';
import * as fromVehicleReferences from './vehicle-reference.reducer';
import * as fromBrandsFlatRateUnit from './brands-flat-rate-unit.reducer';

export interface IVehiclesState {
  readonly vehicles: fromVehicles.VehiclesState;
  readonly vehicleReferences: fromVehicleReferences.VehiclesReferenceState;
  readonly brandsFlatRateUnit: fromBrandsFlatRateUnit.BrandsFlatRateUnitState;
}

export const REDUCERS: ActionReducerMap<IVehiclesState> = {
  vehicles: fromVehicles.reducer,
  vehicleReferences: fromVehicleReferences.reducer,
  brandsFlatRateUnit: fromBrandsFlatRateUnit.reducer
};

export const getCorporateVehiclesState = createFeatureSelector<IVehiclesState>(
  'vehicles'
);
