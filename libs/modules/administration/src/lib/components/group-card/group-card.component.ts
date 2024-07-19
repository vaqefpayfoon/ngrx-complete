import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

import { IGroup } from '../../models';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent {
  @Input() group: IGroup.IDocument;

  @Input() roles: IGroup.IRole[];

  @Input()
  permissions: any;

  @Output()
  delete: EventEmitter<IGroup.IDocument> = new EventEmitter<IGroup.IDocument>();

  deleteGroup(group: IGroup.IDocument) {
    if (this.deletePermission) {
      this.delete.emit(group);
    }
  }

  roleName(uuid: string): string {
    const index = this.roles.findIndex(role => role.uuid === uuid);
    return index !== -1 ? this.roles[index].name : '';
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.AccountGroup.UPDATE_ACCOUNT_GROUP] &&
      this.permissions[permissionTags.AccountGroup.GET_ACCOUNT_GROUP]
    ) {
      return true;
    }
    return false;
  }

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.AccountGroup.DELETE_ACCOUNT_GROUP]
    ) {
      return true;
    }
    return false;
  }

  constructor() {}
}
