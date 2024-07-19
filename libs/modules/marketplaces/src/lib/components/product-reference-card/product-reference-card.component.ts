import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IProductReferences } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-product-reference-card',
  templateUrl: './product-reference-card.component.html',
  styleUrls: ['./product-reference-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReferenceCardComponent {
  @Input() product: IProductReferences.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<IProductReferences.IDocument>();

  constructor() {}

  get description() {
    return this.product.description;
  }

  get image() {
    return this.product.image;
  }

  get unit() {
    return this.product?.unit;
  }

  get service() {
    return this.product.serviceType;
  }

  get unitName() {
    return `${this.product?.unit?.brand} ${this.product?.unit?.model}`;
  }

  get active() {
    return this.product.active;
  }

  get uuid() {
    return this.product.uuid;
  }

  toggleStatus(event?: any) {
    if(this.statusPermission){
      this.status.emit(this.product);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Product.DEACTIVATE_PRODUCT_REFERENCE] &&
      this.permissions[permissionTags.Product.ACTIVATE_PRODUCT_REFERENCE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Product.DEACTIVATE_PRODUCT_REFERENCE]
    ) {
      return this.permissions[
        permissionTags.Product.DEACTIVATE_PRODUCT_REFERENCE
      ] && this.product.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Product.ACTIVATE_PRODUCT_REFERENCE]
    ) {
      return this.permissions[
        permissionTags.Product.ACTIVATE_PRODUCT_REFERENCE
      ] && !this.product.active
        ? true
        : false;
    }

    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Product.GET_PRODUCT_REFERENCE]
    ) {
      return true;
    }
    return false;
  }
}
