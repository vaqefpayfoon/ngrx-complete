import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Angular Form Builder
import { FormGroup, FormControl } from '@angular/forms';

// Models
import { IServices } from '../../models';

// Location
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'neural-service-pricing',
  templateUrl: './service-pricing.component.html',
  styleUrls: ['./service-pricing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicePricingComponent {
  types = IServices.Configuration.Category;

  pricingTypes = IServices.PricingTypes;

  @Input() parent: FormGroup;
  @Input() typeP: boolean;
  @Input() exists: boolean;

  @Input() permissions: any;

  @Input() service: IServices.IDocument;

  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();
  @Output() reseted = new EventEmitter();

  constructor() {}

  get pricing() {
    return this.parent.get('pricing') as FormGroup;
  }

  get type() {
    return this.parent.get('type') as FormControl;
  }

  get tax() {
    return this.parent.get('tax') as FormControl;
  }

  get pricingType() {
    return this.pricing.get('type') as FormControl;
  }

  get unitBuyingPriceNormal() {
    return this.pricing.get('unitBuyingPriceNormal') as FormGroup;
  }

  get recommendedRetailPriceNormal() {
    return this.pricing.get('recommendedRetailPriceNormal') as FormGroup;
  }

  get recommendedRetailPriceBody() {
    return this.pricing.get('recommendedRetailPriceBody') as FormGroup;
  }

  get unitBuyingPriceBody() {
    return this.pricing.get('unitBuyingPriceBody') as FormGroup;
  }

  get unitBuyingPriceRim() {
    return this.pricing.get('unitBuyingPriceRim') as FormGroup;
  }

  get recommendedRetailPriceRim() {
    return this.pricing.get('recommendedRetailPriceRim') as FormGroup;
  }

  selectType(event: MatSelectChange) {
    const { value } = event;
    if (value === this.pricingTypes.NORMAL) {
      this.pricing.get('unitBuyingPriceNormal').enable();
      this.pricing.get('recommendedRetailPriceNormal').enable();

      this.pricing.get('unitBuyingPriceRim').disable();
      this.pricing.get('recommendedRetailPriceRim').disable();
      this.pricing.get('unitBuyingPriceBody').disable();
      this.pricing.get('recommendedRetailPriceBody').disable();
    } else if (value === this.pricingTypes.BODY_STYLE) {
      this.pricing.get('unitBuyingPriceBody').enable();
      this.pricing.get('recommendedRetailPriceBody').enable();
      
      this.pricing.get('unitBuyingPriceNormal').disable();
      this.pricing.get('recommendedRetailPriceNormal').disable();
      this.pricing.get('unitBuyingPriceRim').disable();
      this.pricing.get('recommendedRetailPriceRim').disable();
    } else if (value === this.pricingTypes.RIM_SIZE) {
      this.pricing.get('unitBuyingPriceRim').enable();
      this.pricing.get('recommendedRetailPriceRim').enable();

      this.pricing.get('unitBuyingPriceNormal').disable();
      this.pricing.get('recommendedRetailPriceNormal').disable();
      this.pricing.get('unitBuyingPriceBody').disable();
      this.pricing.get('recommendedRetailPriceBody').disable();
    }
  }

  createService(form: FormGroup) {
    const { valid, touched } = form;
    if (valid && touched && this.createPermission) {
      this.created.emit(true);
    }
  }

  updateService(form: FormGroup) {
    const { valid } = form;
    if (valid && this.updatePermission) {
      this.updated.emit(true);
    }
  }

  enableForm(event: boolean) {
    this.reseted.emit(event);
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Service.CREATE_SERVICE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Service.UPDATE_SERVICE]
    ) {
      return true;
    }
    return false;
  }
}
