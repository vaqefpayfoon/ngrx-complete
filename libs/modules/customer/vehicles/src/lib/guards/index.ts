import { VehiclesGuard } from './vehicles/vehicles.guard';
import { VehicleExistsGuard } from './vehicles/vehicle-exists.guard';

// References
import { VehicleReferencesGuard } from './vehicle-references/vehicle-references.guard';
import { VehicleReferenceExistsGuard } from './vehicle-references/vehicle-reference-exists.guard';

// Brands Flat Rate Unit
import { BrandsFlatRateUnitGuard } from './brands-flat-rate-unit/brands-flat-rate-unit.guard';

export const guards: any[] = [
  VehiclesGuard,
  VehicleExistsGuard,
  VehicleReferencesGuard,
  VehicleReferenceExistsGuard,
  BrandsFlatRateUnitGuard
];

export * from './vehicles/vehicles.guard';
export * from './vehicles/vehicle-exists.guard';
export * from './vehicle-references/vehicle-references.guard';
export * from './vehicle-references/vehicle-reference-exists.guard';
export * from './brands-flat-rate-unit/brands-flat-rate-unit.guard';
