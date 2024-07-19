import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IModels } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-card',
  templateUrl: './model-card.component.html',
  styleUrls: ['./model-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelCardComponent {
  @Input() disabled: boolean;

  @Input() model: IModels.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<IModels.IDocument>();

  constructor() {}

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.DEACTIVATE_MODEL] &&
      this.permissions[permissionTags.Model.ACTIVATE_MODEL]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Model.DEACTIVATE_MODEL]
    ) {
      return this.permissions[permissionTags.Model.DEACTIVATE_MODEL] &&
        this.model.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Model.ACTIVATE_MODEL]
    ) {
      return this.permissions[permissionTags.Model.ACTIVATE_MODEL] &&
        !this.model.active
        ? true
        : false;
    }

    return false;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.model);
    }
  }
}
