import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';

// Model
import { IBusinesses } from '../../models';

// business tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessCardComponent {
  @Input() disabled: boolean;

  @Input() business: IBusinesses.IDocument;

  @Input() permissions: any;

  @Output()
  status = new EventEmitter<IBusinesses.IDocument>();

  constructor() {}

  get name() {
    return this.business.name;
  }

  get registrationNumber() {
    return this.business.registrationNumber;
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Business.DEACTIVATE_BUSINESS] &&
      this.permissions[permissionTags.Business.ACTIVATE_BUSINESS]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Business.DEACTIVATE_BUSINESS]
    ) {
      return this.permissions[permissionTags.Business.DEACTIVATE_BUSINESS] &&
        this.business.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Business.ACTIVATE_BUSINESS]
    ) {
      return this.permissions[permissionTags.Business.ACTIVATE_BUSINESS] &&
        !this.business.active
        ? true
        : false;
    }

    return false;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.business);
    }
  }
}
