import { VehiclesFacade } from './vehicles.facade';
import { VehicleReferenceFacade } from './vehicle-reference.facade';
import { BrandsFlatRateUnitFacade } from './brands-flat-rate-unit.facade';

export const facades: any[] = [
  VehiclesFacade,
  VehicleReferenceFacade,
  BrandsFlatRateUnitFacade
];

export * from './vehicles.facade';
export * from './vehicle-reference.facade';
export * from './brands-flat-rate-unit.facade';
