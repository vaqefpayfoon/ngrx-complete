import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-corporate-card',
  templateUrl: './corporate-card.component.html',
  styleUrls: ['./corporate-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateCardComponent {
  @Input() disabled: boolean;

  @Input() groups: ICorporates.IDocument[];

  @Input() corporate: ICorporates.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<ICorporates.IDocument>();

  constructor() {}

  get type() {
    return this.corporate.type;
  }

  get name() {
    return this.corporate.name;
  }

  get registrationNumber() {
    return this.corporate.registrationNumber;
  }

  get active() {
    return this.corporate.active;
  }

  get image() {
    return this.corporate.image;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.corporate);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.DEACTIVATE_CORPORATE] &&
      this.permissions[permissionTags.Corporate.ACTIVATE_CORPORATE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.DEACTIVATE_CORPORATE]
    ) {
      return this.permissions[permissionTags.Corporate.DEACTIVATE_CORPORATE] &&
        this.corporate.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.ACTIVATE_CORPORATE]
    ) {
      return this.permissions[permissionTags.Corporate.ACTIVATE_CORPORATE] &&
        !this.corporate.active
        ? true
        : false;
    }

    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.GET_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  get previewAppPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.LIST_CORPORATE_APP]
    ) {
      return true;
    }
    return false;
  }

  get previewAgreementPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Agreement.LIST_AGREEMENT]
    ) {
      return true;
    }
    return false;
  }
}
