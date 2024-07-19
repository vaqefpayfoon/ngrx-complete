import { VehiclesResolver } from './vehicles.resolver';
import { VehicleExistsResolver } from './vehicle-exists.resolver';
import { VehicleReferencesResolver } from './vehicle-references.resolver';
import { VehicleReferencesExistResolver } from './vehicle-references-exist.resolver';
import { BrandsFlatRateUnitResolver } from './brands-flat-rate-unit.resolver';

export const resolvers: any[] = [
  VehiclesResolver,
  VehicleExistsResolver,
  VehicleReferencesResolver,
  VehicleReferencesExistResolver,
  BrandsFlatRateUnitResolver,
];

export * from './vehicles.resolver';
export * from './vehicle-exists.resolver';
export * from './vehicle-references.resolver';
export * from './vehicle-references-exist.resolver';
export * from './brands-flat-rate-unit.resolver';
