import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Models
import { IProductCoverages } from '../../models';

// Services
import { IServices } from '@neural/modules/customer/services';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

// Location for Back button
import { Location } from '@angular/common';

// Events
import { MatSelectChange } from '@angular/material/select';

// Auth
import { Auth } from '@neural/auth';

// permission tags
import { permissionTags, traverseAndRemove } from '@neural/shared/data';

@Component({
  selector: 'neural-product-coverage-form',
  templateUrl: './product-coverage-form.component.html',
  styleUrls: ['./product-coverage-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCoverageFormComponent implements OnChanges {
  @Input() product: IProductCoverages.IDocument;

  @Input() services: IServices.IDocument[];

  @Input() permissions: any;

  @Input() branch: Auth.IBranch;

  @Input()
  list: {
    brands: string[];
    models: IProductCoverages.IModel[];
  };

  @Input()
  error: any;

  exists: boolean;

  @Output()
  create: EventEmitter<IProductCoverages.ICreate> = new EventEmitter<
    IProductCoverages.ICreate
  >();

  @Output()
  update: EventEmitter<IProductCoverages.IDocument> = new EventEmitter<
    IProductCoverages.IDocument
  >();

  @Output()
  loaded: EventEmitter<IProductCoverages.IDocument> = new EventEmitter<
    IProductCoverages.IDocument
  >();

  @Output() serviceChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() brandChange: EventEmitter<{
    brand: string;
    serviceType: string;
  }> = new EventEmitter<{ brand: string; serviceType: string }>();

  @Output() branchChange = new EventEmitter();

  form = this.fb.group({
    branchUuid: ['', Validators.compose([Validators.required])],
    productReferenceUuid: ['', Validators.compose([Validators.required])],
    partNumber: ['', Validators.compose([Validators.required])],
    pricing: this.fb.group({
      recommendedRetailPrice: ['', Validators.compose([Validators.required])],
      unitBuyingPrice: ['']
    }),
  });

  selectForm = this.fb.group({
    service: ['', Validators.compose([Validators.required])],
    brand: ['', Validators.compose([Validators.required])],
    model: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {

    if (changes.branch && !changes.branch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.product && changes.product.currentValue) {
      this.loaded.emit(this.product);

      this.exists = true;

      const {
        branchUuid,
        productReferenceUuid,
        productReference: {
          uuid,
          serviceType,
          unit: { brand}
        },
        partNumber,
        pricing
      } = this.product;

      const patchValue = {
        branchUuid,
        productReferenceUuid: uuid,
        partNumber,
        pricing
      };

      const patchSelectValue = {
        service: serviceType,
        brand,
        model : productReferenceUuid,
      }

      this.serviceChange.emit(serviceType);
      this.brandChange.emit({
        brand: brand,
        serviceType
      });

      this.form.patchValue(patchValue);
      this.selectForm.patchValue(patchSelectValue);

      this.disableForms();
    }

    if (changes.branch && changes.branch.currentValue) {
      this.branchUuid.patchValue(this.branch.uuid);
    }
  }

  specificationGroup() {
    return this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  behaviourForm(event: boolean) {
    if (event) {
      if(this.exists){
        this.form.reset();

        this.loaded.emit(this.product);
  
        const {
          branchUuid,
          productReferenceUuid,
          productReference: {
            uuid,
            serviceType,
            unit: { brand}
          },
          partNumber,
          pricing
        } = this.product;
  
        const patchValue = {
          branchUuid,
          productReferenceUuid: uuid,
          partNumber,
          pricing
        };

        const patchSelectValue = {
          service: serviceType,
          brand,
          model : productReferenceUuid,
        }
  
        this.serviceChange.emit(serviceType);
        this.brandChange.emit({
          brand: brand,
          serviceType
        });
  
        this.form.patchValue(patchValue);
        this.selectForm.patchValue(patchSelectValue);
  
        return this.disableForms();
      } else {
        return this.location.back();
      }
    } else {
      this.enableForms();

      this.productReferenceUuid.disable();
      this.branchUuid.disable();
      this.service.disable();
      this.brand.disable();
      this.model.disable();

    }
  }

  updateProduct(form: FormGroup) {
    const { valid, value, touched } = form;

    if (valid && touched) {
      traverseAndRemove(value);

      this.update.emit({
        ...this.product,
        ...value
      });

      this.disableForms()
    }
  }

  createProduct(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      traverseAndRemove(value);

      this.create.emit(value);

      this.disableForms();
    }
  }

  onChangeService(event: MatSelectChange) {
    const { value } = event;

    this.brand.reset();
    this.model.reset();

    this.serviceChange.emit(value);
  }

  onChangeBrand(event: MatSelectChange) {
    const { value } = event;
    this.model.reset();

    this.brandChange.emit({ brand: value, serviceType: this.service.value });
  }

  onChangeModel(event: MatSelectChange) {
    const { value } = event;

    this.productReferenceUuid.patchValue(value);
  }

  disableForms() {
    this.form.disable();
    this.selectForm.disable();
  }

  enableForms() {
    this.form.enable();
    this.selectForm.enable();
  }

  get partNumber() {
    return this.form.get('partNumber') as FormControl;
  }

  get productReferenceUuid() {
    return this.form.get('productReferenceUuid') as FormControl;
  }

  get branchUuid() {
    return this.form.get('branchUuid') as FormControl;
  }

  get service() {
    return this.selectForm.get('service') as FormControl;
  }

  get brand() {
    return this.selectForm.get('brand') as FormControl;
  }

  get model() {
    return this.selectForm.get('model') as FormControl;
  }
  
  get pricing() {
    return this.form.get('pricing') as FormGroup;
  }

  get formDisabled() {
    return this.form.disabled && this.selectForm.disabled;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Product.CREATE_PRODUCT_REFERENCE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Product.UPDATE_PRODUCT_REFERENCE]
    ) {
      return true;
    }
    return false;
  }
}
