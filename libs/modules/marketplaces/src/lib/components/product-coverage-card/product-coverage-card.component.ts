import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IProductCoverages } from '../../models';

// Services
import { IServices } from '@neural/modules/customer/services';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-product-coverage-card',
  templateUrl: './product-coverage-card.component.html',
  styleUrls: ['./product-coverage-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCoverageCardComponent {
  @Input() product: IProductCoverages.IDocument;

  @Input() services: IServices.IDocument[];
  
  @Input() permissions: any;

  @Output() status = new EventEmitter<IProductCoverages.IDocument>();
  @Output() delete = new EventEmitter<IProductCoverages.IDocument>();

  constructor() {}

  get serviceName() {
    const index = this.services.findIndex(
      x => x.type === this.product.productReference.serviceType
    );
    if (index !== -1) {
      return this.services[index].title;
    }
    return false;
  }
  
  get serviceIcon() {
    const index = this.services.findIndex(
      x => x.type === this.product.productReference.serviceType
    );
    if (index !== -1) {
      return this.services[index].icon;
    }
  }

  get productReference() {
    return this.product ? this.product.productReference : null;
  }

  get unit() {
    return this.productReference ? this.productReference.unit : null;
  }

  get active() {
    return this.product ? this.product.active : false;
  }

  get uuid() {
    return this.product ? this.product.uuid : null;
  }


  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.product);
    }
  }
  
  toggleDelete(event?: any) {
    if (this.deletePermission) {
      this.delete.emit(this.product);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Product.DEACTIVATE_PRODUCT_COVERAGE] &&
      this.permissions[permissionTags.Product.ACTIVATE_PRODUCT_COVERAGE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Product.DEACTIVATE_PRODUCT_COVERAGE]
    ) {
      return this.permissions[permissionTags.Product.DEACTIVATE_PRODUCT_COVERAGE] &&
        this.product.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Product.ACTIVATE_PRODUCT_COVERAGE]
    ) {
      return this.permissions[permissionTags.Product.ACTIVATE_PRODUCT_COVERAGE] &&
        !this.product.active
        ? true
        : false;
    }

    return false;
  }
  
  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Product.DELETE_PRODUCT_COVERAGE]
    ) {
      return true;
    }

    return false;
  }

}
