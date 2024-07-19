import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IWarranties } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-warranty-card',
  templateUrl: './warranty-card.component.html',
  styleUrls: ['./warranty-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarrantyCardComponent {
  @Input() warranty: IWarranties.IDocument;
  
  @Input() permissions: any;

  @Output() closeChange: EventEmitter<IWarranties.IDocument> = new EventEmitter<
    IWarranties.IDocument
  >();

  statusEnum = IWarranties.Status;
  progressBar = IWarranties.ProgressBar;

  constructor() {}

  get account() {
    return this.warranty ? this.warranty.account : null;
  }

  get name() {
    return this.account ? this.account.identity : null;
  }

  get phone() {
    return this.account ? this.account.phone : null;
  }

  get accountVehicle() {
    return this.warranty ? this.warranty.accountVehicle : null;
  }

  get vehicleReference() {
    return this.accountVehicle ? this.accountVehicle.vehicleReference : null;
  }

  get unit() {
    return this.vehicleReference ? this.vehicleReference.unit : null;
  }

  get numberPlate() {
    return this.accountVehicle ? this.accountVehicle.numberPlate : null;
  }

  get uuid() {
    return this.warranty ? this.warranty.uuid : null;
  }

  get rawStatus() {
    return this.warranty ? this.warranty.status : null;
  }

  get status() {
    return this.warranty ? this.statusName(this.warranty.status) : null;
  }

  statusName(status: string) {
    switch (status) {
      case IWarranties.Status.CLOSED:
        return 'CLOSED';
      case IWarranties.Status.FIRST_NOTIFICATION:
        return 'FIRST NOTIFICATION';
      case IWarranties.Status.FOLLOW_UP:
        return 'FOLLOW UP';
      case IWarranties.Status.NOT_REACHED:
        return 'NOT REACHED';
      case IWarranties.Status.SECOND_NOTIFICATION:
        return 'SECOND NOTIFICATION';
    }
  }
  
  shortStatusName(status: string) {
    switch (status) {
      case IWarranties.Status.FIRST_NOTIFICATION:
        return '1st Notification';
      case IWarranties.Status.FOLLOW_UP:
        return 'Follow UP';
      case IWarranties.Status.SECOND_NOTIFICATION:
        return '2nd Notification';
    }
  }

  get time() {
    return this.accountVehicle.registrationDate;
  }

  closeWarranty() {
    if(this.closePermission){
      this.closeChange.emit(this.warranty);
    }
  }

  get closePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ServiceRecall.CLOSE_SERVICE_RECALL]
    ) {
      return true;
    }
    return false;
  }
  
  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ServiceRecall.GET_SERVICE_RECALL]
    ) {
      return true;
    }
    return false;
  }
}
