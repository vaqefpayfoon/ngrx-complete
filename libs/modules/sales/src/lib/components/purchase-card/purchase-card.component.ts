import { Component, ChangeDetectionStrategy } from '@angular/core';

// Model
import { IPurchases, ISales } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

import { ISaleCard } from '../../models';

import { PurchaseDirective } from '../../directives';

@Component({
  selector: 'neural-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseCardComponent
  extends PurchaseDirective<IPurchases.IDocument>
  implements ISaleCard.IPurchaseCard {
  constructor() {
    super();
  }

  get previewPermission(): boolean {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.GET_SALE]
    ) {
      return true;
    }
    return false;
  }

  get complete() {
    if (
      this.purchase?.status !== ISales.Status.COMPLETED &&
      this.purchase?.status !== ISales.Status.CANCELLED
    ) {
      return true;
    }
    return false;
  }

  get cancel() {
    if (
      this.purchase?.status !== ISales.Status.CANCELLED &&
      this.purchase?.status !== ISales.Status.COMPLETED
    ) {
      return true;
    }
    return false;
  }

  get inProcess() {
    if (this.purchase?.status !== ISales.Status.IN_PROCESS) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (this.permissions && this.permissions[permissionTags.Sale.UPDATE_SALE]) {
      return true;
    }
    return false;
  }

  get cancelPermission() {
    if (this.permissions && this.permissions[permissionTags.Sale.CANCEL_SALE]) {
      return true;
    }
    return false;
  }

  get completePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.COMPLETE_SALE]
    ) {
      return true;
    }
    return false;
  }
}
