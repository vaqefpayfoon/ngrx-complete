import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-template-config',
  templateUrl: './template-config.component.html',
  styleUrls: ['./template-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateConfigComponent {
  @Input() permissions: any;

  constructor() {}

  get fromMasterPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.CREATE_FROM_MASTER_TEMPLATE]
    ) {
      return true;
    }
    return false;
  }

  get masterPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.CREATE_MASTER_TEMPLATE]
    ) {
      return true;
    }
    return false;
  }
}
