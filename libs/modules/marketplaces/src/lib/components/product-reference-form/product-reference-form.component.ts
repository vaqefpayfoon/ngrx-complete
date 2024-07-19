import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

// Models
import { IProductReferences } from '../../models';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';

// Location for Back button
import { Location } from '@angular/common';

import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'neural-product-reference-form',
  templateUrl: './product-reference-form.component.html',
  styleUrls: ['./product-reference-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReferenceFormComponent implements OnChanges {
  @Input() product: IProductReferences.IDocument;

  @Input() permissions: any;

  @Input()
  error: any;

  exists: boolean;

  @Output()
  create: EventEmitter<IProductReferences.ICreate> = new EventEmitter<
    IProductReferences.ICreate
  >();

  @Output()
  update: EventEmitter<IProductReferences.IUpdate> = new EventEmitter<
    IProductReferences.IUpdate
  >();

  @Output()
  loaded: EventEmitter<IProductReferences.IDocument> = new EventEmitter<
    IProductReferences.IDocument
  >();

  form = this.fb.group({
    serviceType: ['', Validators.compose([Validators.required])],
    description: ['', Validators.compose([Validators.required])],
    image: [null, Validators.compose([Validators.required])],
    unit: this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      specification: this.fb.group(this.specificationGroup()),
    }),
  });

  url = '';

  serviceTypes = IProductReferences.ServiceTypes;

  public height: any = '350px';
  public width: any = '800px';

  public tools: object = {
    items: [
      'Bold',
      'Italic',
      'Underline',
      '|',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'Formats',
      'Alignments',
      'OrderedList',
      'UnorderedList',
      '|',
      'CreateLink',
      'Image',
      '|',
      'SourceCode',
      '|',
      'Undo',
      'Redo',
    ],
  };

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges() {
    if (this.product) {
      this.loaded.emit(this.product);
      const { description, unit, serviceType, image } = this.product;

      Object.keys(IProductReferences.Specification)
        .filter((x) => x !== serviceType)
        .map((k) => this.specificationFormGroup.get(k).disable());

      this.specificationFormGroup.get(serviceType).enable();

      const specObject = {};

      unit?.specification
        .map((spec) => {
          const key = spec.key?.toUpperCase().replace(' ', '_');
          return {
            [key]: spec.value,
          };
        })
        .map((x) => {
          for (const key of Object.keys(x)) {
            specObject[key] = x[key];
          }
        });

      if (image) {
        this.url = image.substring(image.lastIndexOf('/') + 1);
      }

      this.specificationFormGroup.patchValue({
        [serviceType]: specObject,
      });
      this.form.patchValue({
        serviceType,
        description,
        image,
      });

      this.brand.patchValue(unit?.brand);
      this.model.patchValue(unit?.model);

      this.exists = true;

      this.form.disable();
    }
  }

  specificationGroup() {
    const keys = Object.keys(IProductReferences.Specification);
    const obj = {};

    for (const key of keys) {
      const objGroup = {};

      for (const group of Object.keys(IProductReferences.Specification[key])) {
        objGroup[group] = new FormControl('', Validators.required);
      }

      obj[key] = new FormGroup(objGroup);
    }

    return obj;
  }

  behaviourForm(event: boolean) {
    if (!event) {
      this.form.enable();

      this.serviceType.disable();

      const { unit, serviceType } = this.product;

      Object.keys(IProductReferences.Specification)
        .filter((x) => x !== serviceType)
        .map((k) => this.specificationFormGroup.get(k).disable());

      this.specificationFormGroup.get(serviceType).enable();

      const specObject = {};

      unit.specification
        .map((spec) => {
          const key = spec.key.toUpperCase().replace(' ', '_');
          return {
            [key]: spec.value,
          };
        })
        .map((x) => {
          for (const key of Object.keys(x)) {
            specObject[key] = x[key];
          }
        });
    } else {
      if (!this.exists) {
        return this.location.back();
      }

      if (this.product) {
        this.loaded.emit(this.product);
        const { description, unit, serviceType, image } = this.product;

        Object.keys(IProductReferences.Specification)
          .filter((x) => x !== serviceType)
          .map((k) => this.specificationFormGroup.get(k).disable());

        this.specificationFormGroup.get(serviceType).enable();

        const specObject = {};

        unit.specification
          .map((spec) => {
            const key = spec.key.toUpperCase().replace(' ', '_');
            return {
              [key]: spec.value,
            };
          })
          .map((x) => {
            for (const key of Object.keys(x)) {
              specObject[key] = x[key];
            }
          });

        if (image) {
          this.url = image.substring(image.lastIndexOf('/') + 1);
        }

        this.specificationFormGroup.patchValue({
          [serviceType]: specObject,
        });
        this.form.patchValue({
          serviceType,
          description,
          image,
        });

        this.brand.patchValue(unit?.brand);
        this.model.patchValue(unit?.model);

        this.exists = true;

        this.form.disable();
      }
    }
  }

  get serviceType() {
    return this.form.get('serviceType') as FormControl;
  }

  get description() {
    return this.form.get('description') as FormControl;
  }

  get image() {
    return this.form.get('image') as FormControl;
  }

  get imageUrl() {
    return this.product && this.product.image ? this.product.image : null;
  }

  get unit() {
    return this.form.get('unit') as FormGroup;
  }

  get brand() {
    return this.unit.get('brand') as FormControl;
  }

  get model() {
    return this.unit.get('model') as FormControl;
  }

  get specifications() {
    return (this.unit.get('specification') as FormGroup).controls;
  }

  get specificationFormGroup() {
    return this.unit.get('specification') as FormGroup;
  }

  getSpecificationObjects(control: string) {
    return (this.specificationFormGroup.get(control) as FormGroup).controls;
  }

  get specificationsObjects() {
    return Object.keys((this.unit.get('specification') as FormGroup).controls);
  }

  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file,
    });
    this.image.updateValueAndValidity();
  }

  createProduct(form: FormGroup) {
    const { valid, value } = form;

    if (valid && this.createPermission) {
      const {
        unit: { specification },
        serviceType,
      } = value;

      let specsArr = [];

      if (specification) {
        const specs = Object.keys(specification);

        specs.map((x) => {
          Object.keys(specification[x]).map((k) =>
            specsArr.push({
              key: this.toCamelCaseString(k),
              value: specification[x][k],
            })
          );
        });
      }

      const formValue = {
        ...value,
        unit: {
          ...value.unit,
          specification: specsArr,
        },
        serviceType,
      };

      this.create.emit(formValue);

      this.form.disable();
    }
  }

  updateProduct(form: FormGroup) {
    const { valid, value } = form;

    if (valid && this.updatePermission) {
      const {
        unit: { specification },
      } = value;

      const specsArr = [];

      if (specification) {
        const specs = Object.keys(specification);

        specs.map((x) => {
          Object.keys(specification[x]).map((k) =>
            specsArr.push({
              key: this.toCamelCaseString(k),
              value: specification[x][k],
            })
          );
        });
      }

      this.update.emit({
        ...this.product,
        ...value,
        unit: {
          ...value.unit,
          specification: specsArr,
        },
      });

      this.form.disable();
    }
  }

  removeExtra(value: string) {
    return value.replace('_', ' ');
  }

  selected(event: MatSelectChange) {
    const { value } = event;

    switch (value) {
      case 'TYRE':
        this.specificationFormGroup.get('TYRE').enable();
        this.specificationFormGroup.get('BATTERY').disable();
        this.specificationFormGroup.get('BRAKE_PAD').disable();
        this.specificationFormGroup.get('BRAKE_DISC').disable();
        break;
      case 'BRAKE_DISC':
        this.specificationFormGroup.get('BATTERY').disable();
        this.specificationFormGroup.get('TYRE').disable();
        this.specificationFormGroup.get('BRAKE_PAD').disable();
        this.specificationFormGroup.get('BRAKE_DISC').enable();
        break;
      case 'BRAKE_PAD':
        this.specificationFormGroup.get('BRAKE_PAD').enable();
        this.specificationFormGroup.get('TYRE').disable();
        this.specificationFormGroup.get('BATTERY').disable();
        this.specificationFormGroup.get('BRAKE_DISC').disable();
        break;
      case 'BATTERY':
        this.specificationFormGroup.get('BATTERY').enable();
        this.specificationFormGroup.get('TYRE').disable();
        this.specificationFormGroup.get('BRAKE_PAD').disable();
        this.specificationFormGroup.get('BRAKE_DISC').disable();
        break;
    }
  }
  toCamelCaseString(str: string) {
    const splitStr = str.replace('_', ' ').toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
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
