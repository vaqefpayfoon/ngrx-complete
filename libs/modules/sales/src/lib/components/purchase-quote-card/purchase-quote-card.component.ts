import { Component, ChangeDetectionStrategy } from '@angular/core';

// Model
import { IPurchases } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

import { ISaleCard } from '../../models';

import { PurchaseDirective } from '../../directives';

@Component({
  selector: 'neural-purchase-quote-card',
  templateUrl: './purchase-quote-card.component.html',
  styleUrls: [
    '../purchase-card/purchase-card.component.scss',
    './purchase-quote-card.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseQuoteCardComponent
  extends PurchaseDirective<IPurchases.IDocument>
  implements ISaleCard.IPurchaseQouteCard {
  constructor() {
    super();
  }

  get previewPermission(): boolean {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.GET_PURCHASE_QUOTE]
    ) {
      return true;
    }
    return false;
  }
}
