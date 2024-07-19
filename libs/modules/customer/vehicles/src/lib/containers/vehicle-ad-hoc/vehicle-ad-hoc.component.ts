import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Account tags
import { permissionTags } from '@neural/shared/data';
@Component({
  selector: 'neural-vehicle-ad-hoc',
  templateUrl: './vehicle-ad-hoc.component.html',
  styleUrls: ['./vehicle-ad-hoc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleAdHocComponent {
  @Input() permissions: any;

  constructor() {}

  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.GET_VEHICLE]
    ) {
      return true;
    }
    return false;
  }
}
