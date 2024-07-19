import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Model
import { IAccount, IGroup } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

import { Buttons, ButtonTypes } from '@neural/shared/classes';

@Component({
  selector: 'neural-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent {
  @Input() groups: IGroup.IDocument[];

  @Input() account: IAccount.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<IAccount.IDocument>();

  @Output() deleted = new EventEmitter<IAccount.IDocument>();

  @Output() resynced = new EventEmitter<IAccount.IDocument>();

  @Output() firebaseResynced = new EventEmitter<IAccount.IDocument>();

  @Output() qrcodeChange = new EventEmitter<IAccount.IDocument>();

  buttons = new Buttons();

  constructor() {}

  get buttonTypes() {
    return ButtonTypes;
  }

  get groupName() {
    const { permissions } = this.account;

    if (permissions && permissions.operationRole) {
      return permissions.operationRole;
    } else if (permissions && permissions.adminGroupUuid) {
      const index = this.groups.findIndex(
        (x) => x.uuid === permissions.adminGroupUuid
      );

      return index !== -1 ? this.groups[index].name : 'Access Denied';
    }

    return null;
  }

  get qrcode() {
    return this.account.qrCode;
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Account.DEACTIVATE_ACCOUNT] &&
      this.permissions[permissionTags.Account.ACTIVATE_ACCOUNT]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Account.DEACTIVATE_ACCOUNT]
    ) {
      return this.permissions[permissionTags.Account.DEACTIVATE_ACCOUNT] &&
        this.account.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Account.ACTIVATE_ACCOUNT]
    ) {
      return this.permissions[permissionTags.Account.ACTIVATE_ACCOUNT] &&
        !this.account.active
        ? true
        : false;
    }

    return false;
  }

  get firebaseResyncPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Account.RESYNC_AUTH_ACCOUNT]
    ) {
      return true;
    }
    return false;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.account);
    }
  }

  toggleQrCode() {
    this.qrcodeChange.emit(this.account);
  }

  toggleDelete() {
    this.deleted.emit(this.account);
  }

  toggleResync() {
    this.resynced.emit(this.account);
  }

  toggleFirebaseResync() {
    this.firebaseResynced.emit(this.account);
  }
}
