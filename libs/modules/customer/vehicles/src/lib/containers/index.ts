import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleItemComponent } from './vehicle-item/vehicle-item.component';
import { VehicleAdHocComponent } from './vehicle-ad-hoc/vehicle-ad-hoc.component';

// References
import { VehicleReferencesComponent } from './vehicle-references/vehicle-references.component';
import { VehicleReferenceItemComponent } from './vehicle-reference-item/vehicle-reference-item.component';

// Brands Flat unit rate
import { BrandsFlatRateUnitComponent } from './brands-flat-rate-unit/brands-flat-rate-unit.component';
import { BrandsFlatRateUnitItemComponent } from './brands-flat-rate-unit-item/brands-flat-rate-unit-item.component';

export const COMPONENTS: any[] = [
  VehiclesComponent,
  VehicleItemComponent,
  VehicleReferencesComponent,
  VehicleReferenceItemComponent,
  BrandsFlatRateUnitComponent,
  BrandsFlatRateUnitItemComponent,
  VehicleAdHocComponent,
];

export * from './vehicles/vehicles.component';
export * from './vehicle-item/vehicle-item.component';
export * from './vehicle-references/vehicle-references.component';
export * from './vehicle-reference-item/vehicle-reference-item.component';
export * from './brands-flat-rate-unit/brands-flat-rate-unit.component';
export * from './brands-flat-rate-unit-item/brands-flat-rate-unit-item.component';
export * from './vehicle-ad-hoc/vehicle-ad-hoc.component';
