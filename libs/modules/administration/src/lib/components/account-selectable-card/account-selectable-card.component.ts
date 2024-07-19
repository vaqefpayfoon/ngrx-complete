import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IAccount, IGroup } from '../../models';

@Component({
  selector: 'neural-account-selectable-card',
  templateUrl: './account-selectable-card.component.html',
  styleUrls: ['./account-selectable-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSelectableCardComponent {

  @Input() groups: IGroup.IDocument[];

  @Input() account: IAccount.IDocument;
  
  @Input() selected: IAccount.IDocument |  null;

  @Output() qrcodeChange = new EventEmitter<IAccount.IDocument>();
  

  constructor() {}

  get groupName() {
    const { permissions } = this.account;

    if (permissions && permissions.operationRole) {
      return permissions.operationRole;
    } else if (permissions && permissions.adminGroupUuid) {
      const index = this.groups.findIndex(
        x => x.uuid === permissions.adminGroupUuid
      );

      return index !== -1 ? this.groups[index].name : 'Access Denied';
    }

    return null;
  }

  get qrcode() {
    return this.account.qrCode;
  }

  toggleQrCode() {
    this.qrcodeChange.emit(this.account);
  }

}
