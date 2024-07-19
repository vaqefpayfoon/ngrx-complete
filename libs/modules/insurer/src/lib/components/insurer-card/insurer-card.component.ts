import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Model
import { IInsurer } from '../../models';

// insurer tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-insurer-card',
  templateUrl: './insurer-card.component.html',
  styleUrls: ['./insurer-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurerCardComponent {
  @Input() disabled = false;

  @Input() insurer!: IInsurer.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<IInsurer.IDocument>();

  @Output() delete = new EventEmitter<IInsurer.IDocument>();

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Insurer.DEACTIVATE_INSURER] &&
      this.permissions[permissionTags.Insurer.ACTIVATE_INSURER]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Insurer.DEACTIVATE_INSURER]
    ) {
      return this.permissions[permissionTags.Insurer.DEACTIVATE_INSURER] &&
        this.insurer.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Insurer.ACTIVATE_INSURER]
    ) {
      return this.permissions[permissionTags.Insurer.ACTIVATE_INSURER] &&
        !this.insurer.active
        ? true
        : false;
    }

    return false;
  }

  get deletePermission(): boolean {
    if (
      this.permissions &&
      this.permissions[permissionTags.Insurer.DELETE_INSURER]
    ) {
      return true;
    }
    return false;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.insurer);
    }
  }

  onDelete() {
    if (this.deletePermission) {
      this.delete.emit(this.insurer);
    }
  }
}
