import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

// Models
import { IVehicle } from '../../models';

@Component({
  selector: 'neural-vehicle-warranty-package',
  templateUrl: './vehicle-warranty-package.component.html',
  styleUrls: ['./vehicle-warranty-package.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleWarrantyPackageComponent {
  @Input() warrantyPackages: IVehicle.IWarrantyPackage[];

  constructor() {}
}
