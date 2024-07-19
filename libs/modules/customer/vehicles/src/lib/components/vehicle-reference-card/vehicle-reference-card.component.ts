import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IVehicleReference } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-vehicle-reference-card',
  templateUrl: './vehicle-reference-card.component.html',
  styleUrls: ['./vehicle-reference-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleReferenceCardComponent {

  @Input() disabled: boolean;

  @Input() reference: IVehicleReference.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<IVehicleReference.IDocument>();

  constructor() {}

  get type() {
    return this.reference.type;
  }

  get unit() {
    return this.reference.unit;
  }
  
  get bodyStyle() {
    return this.unit.bodyStyle;
  }
  
  get capacity() {
    return this.reference.engine.capacity;
  }

  get brand() {
    return this.unit.brand;
  }

  get unitName() {
    return `${this.unit.model.display ?? ''} ${this.unit.variant.display ?? ''}`
  }
  
  get startYear() {
    return this.reference.production.start;
  }
  
  get endYear() {
    return this.reference.production.end === 0 ? 'Current' : this.reference.production.end;
  }
  
  get isActive() {
    return this.reference.active;
  }
  
  get uuid() {
    return this.reference.uuid;
  }

  toggleStatus(event?: any) {
    // this.status.emit(this.reference);
    if (this.statusPermission) {
      this.status.emit(this.reference);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE_REFERENCE] &&
      this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE_REFERENCE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE_REFERENCE]
    ) {
      return this.permissions[
        permissionTags.Vehicle.DEACTIVATE_VEHICLE_REFERENCE
      ] && this.reference.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE_REFERENCE]
    ) {
      return this.permissions[
        permissionTags.Vehicle.ACTIVATE_VEHICLE_REFERENCE
      ] && !this.reference.active
        ? true
        : false;
    }

    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.GET_VEHICLE_REFERENCE]
    ) {
      return true;
    }
    return false;
  }

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE_REFERENCE]
    ) {
      return true;
    }
    return false;
  }

}
