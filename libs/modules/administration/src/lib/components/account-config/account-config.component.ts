import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-account-config',
  templateUrl: './account-config.component.html',
  styleUrls: ['./account-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountConfigComponent {
  @Input() permissions: any;

  constructor() {}

  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Account.GET_ACCOUNT_BY_EMAIL]
    ) {
      return true;
    }
    return false;
  }
}
