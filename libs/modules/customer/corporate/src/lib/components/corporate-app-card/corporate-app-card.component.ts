import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IApps } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-corporate-app-card',
  templateUrl: './corporate-app-card.component.html',
  styleUrls: ['./corporate-app-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateAppCardComponent {
  @Input() disabled: boolean;

  @Input() app: IApps.IDocument;

  @Input() permissions: any;

  @Input() token: string;

  @Output() status = new EventEmitter<IApps.IDocument>();

  @Output() generateChange = new EventEmitter<IApps.IDocument>();

  constructor() {}

  get type() {
    return this.app.type;
  }

  get name() {
    return this.app.name;
  }

  get payload() {
    return this.app.payload;
  }

  get active() {
    return this.app.active;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.app);
    }
  }

  regenerateApp(corporateApp: IApps.IDocument) {
    if (this.statusPermission) {
      this.generateChange.emit(corporateApp);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.DEACTIVATE_CORPORATE_APP] &&
      this.permissions[permissionTags.Corporate.ACTIVATE_CORPORATE_APP]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.DEACTIVATE_CORPORATE_APP]
    ) {
      return this.permissions[
        permissionTags.Corporate.DEACTIVATE_CORPORATE_APP
      ] && this.app.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.ACTIVATE_CORPORATE_APP]
    ) {
      return this.permissions[
        permissionTags.Corporate.ACTIVATE_CORPORATE_APP
      ] && !this.app.active
        ? true
        : false;
    }

    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.GET_CORPORATE_APP]
    ) {
      return true;
    }
    return false;
  }

  get regenerateTokenPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.REGENERATE_CORPORATE_APP_TOKEN]
    ) {
      return true;
    }
    return false;
  }
}
