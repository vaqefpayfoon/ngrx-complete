import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Model
import { IPromotions } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-promotion-card',
  templateUrl: './promotion-card.component.html',
  styleUrls: ['./promotion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionCardComponent {
  @Input() disabled: boolean;

  @Input() promotion: IPromotions.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<IPromotions.IDocument>();
  @Output() redeem = new EventEmitter<IPromotions.IDocument>();

  constructor() {}

  get discountType() {
    return IPromotions.DiscountTypes;
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Promo.DEACTIVATE_PROMO] &&
      this.permissions[permissionTags.Promo.ACTIVATE_PROMO]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Promo.DEACTIVATE_PROMO]
    ) {
      return this.permissions[permissionTags.Promo.DEACTIVATE_PROMO] &&
        this.promotion.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Promo.ACTIVATE_PROMO]
    ) {
      return this.permissions[permissionTags.Promo.ACTIVATE_PROMO] &&
        !this.promotion.active
        ? true
        : false;
    }

    return false;
  }

  get mobileServiceType() {
    return IPromotions.Types.MOBILE_SERVICE_FEE
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.promotion);
    }
  }

  toggleRedeem(event?: any) {
    if (this.statusPermission) {
      this.redeem.emit(this.promotion);
    }
  }

}
