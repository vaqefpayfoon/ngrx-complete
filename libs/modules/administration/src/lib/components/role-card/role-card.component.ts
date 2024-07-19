import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

// Models
import { IRole } from '../../models';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-role-card',
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleCardComponent {
  collapsed = true;

  @Input()
  role: IRole.IDocument;

  @Input()
  permissions: any;

  @Input()
  tagPermissions: any;

  @Output()
  delete: EventEmitter<IRole.IDocument> = new EventEmitter<IRole.IDocument>();

  deleteRole(role: IRole.IDocument) {
    if (this.deletePermission) {
      this.delete.emit(role);
    }
  }

  get previewPermission() {
    if (
      this.tagPermissions &&
      this.tagPermissions[permissionTags.AccountRole.GET_ACCOUNT_ROLE] &&
      this.tagPermissions[permissionTags.AccountRole.UPDATE_ACCOUNT_ROLE]
    ) {
      return true;
    }
    return false;
  }

  get deletePermission() {
    if (
      this.tagPermissions &&
      this.tagPermissions[permissionTags.AccountRole.DELETE_ACCOUNT_ROLE]
    ) {
      return true;
    }
    return false;
  }

  constructor() {}
}
