import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IFleet } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-fleet-card',
  templateUrl: './fleet-card.component.html',
  styleUrls: ['./fleet-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetCardComponent {

  @Input() disabled: boolean;

  @Input() fleet: IFleet.IDocument;

  @Output() status = new EventEmitter<IFleet.IDocument>();

  @Input() permissions: any;

  constructor() {}
  
  get name() {
    return this.fleet.name;
  }
  
  get numberPlate() {
    return this.fleet.numberPlate;
  }
  
  get active() {
    return this.fleet.active;
  }

  toggleStatus(event?: any) {
    if(this.statusPermission){
      this.status.emit(this.fleet);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Fleet.DEACTIVATE_FLEET] &&
      this.permissions[permissionTags.Fleet.ACTIVATE_FLEET]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Fleet.DEACTIVATE_FLEET]
    ) {
      return this.permissions[
        permissionTags.Fleet.DEACTIVATE_FLEET
      ] && this.fleet.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Fleet.ACTIVATE_FLEET]
    ) {
      return this.permissions[
        permissionTags.Fleet.ACTIVATE_FLEET
      ] && !this.fleet.active
        ? true
        : false;
    }

    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Fleet.GET_FLEET]
    ) {
      return true;
    }
    return false;
  }

}
