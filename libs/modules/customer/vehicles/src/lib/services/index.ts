import { VehiclesService } from './vehicles.service';
import { VehicleReferencesService } from './vehicle-references.service';
import { BrandsFlatRateUnitService } from './brands-flat-rate-unit.service';

export const services: any[] = [
  VehiclesService,
  VehicleReferencesService,
  BrandsFlatRateUnitService
];

export * from './vehicles.service';
export * from './vehicle-references.service';
export * from './brands-flat-rate-unit.service';
