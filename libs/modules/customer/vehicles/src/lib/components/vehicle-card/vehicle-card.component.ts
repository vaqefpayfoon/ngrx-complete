import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';

// Model
import { IVehicle } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleCardComponent {
  @Input() disabled: boolean;

  @Input() permissions: any;

  @Input() vehicle: IVehicle.IDocument;

  @Output() status = new EventEmitter<IVehicle.IDocument>();

  constructor() {}

  get account() {
    return this.vehicle.account;
  }

  get reference() {
    return this.vehicle?.vehicleReference;
  }

  get type() {
    return this.reference?.type;
  }

  get number() {
    return this.vehicle.numberPlate;
  }

  get unit() {
    return this.reference?.unit;
  }

  get brand() {
    return this?.unit?.brand;
  }

  get model() {
    return this.unit.model;
  }

  get variant() {
    return this.unit.variant;
  }

  get active() {
    return this.vehicle.active;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.vehicle);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE] &&
      this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE]
    ) {
      return this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE] &&
        this.vehicle.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE]
    ) {
      return this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE] &&
        !this.vehicle.active
        ? true
        : false;
    }

    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.GET_VEHICLE]
    ) {
      return true;
    }
    return false;
  }
}
