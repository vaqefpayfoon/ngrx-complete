import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-config',
  templateUrl: './model-config.component.html',
  styleUrls: ['./model-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelConfigComponent {
  @Input() permissions: any;

  constructor() {}

  get modelBranchesPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.SET_MODEL_BRANCHES]
    ) {
      return true;
    }
    return false;
  }

  get modelImagePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.SET_MODEL_IMAGE]
    ) {
      return true;
    }
    return false;
  }

  get seriesImagePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.GET_SERIES_IMAGE]
    ) {
      return true;
    }
    return false;
  }
}
