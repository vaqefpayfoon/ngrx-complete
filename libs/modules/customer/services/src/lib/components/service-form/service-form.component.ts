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
import { IServices } from '../../models';

// Auth
import { Auth } from '@neural/auth';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl
} from '@angular/forms';

// Location
import { Location } from '@angular/common';

// Material Event
import { MatSelectChange } from '@angular/material/select';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceFormComponent implements OnChanges {
  types = IServices.Configuration.Category;

  category = IServices.Category;

  pricingTypes = IServices.PricingTypes;

  serviceCenterTypes = IServices.ServiceCenterTypes;

  @Input() service: IServices.IDocument;

  @Input() selectedBranch: Auth.IBranch;

  @Input() selectedCorporate: Auth.ICorporates;

  @Input() error: any;

  @Input() permissions: any;

  exists: boolean;
  editable: boolean;

  form = this.fb.group({
    type: ['', Validators.required],
    corporateUuid: ['', Validators.required],
    branchUuid: ['', Validators.required],
    appointment: this.fb.group({
      mobileService: [false, Validators.required],
      serviceCenter: ['', Validators.required]
    }),
    description: ['', Validators.required],
    title: ['', Validators.required],
    subtitle: ['', Validators.required],
    flatRateUnit: ['', Validators.required],
    tax: ['', Validators.required],
    pricing: this.fb.group(this.pricingGroup)
  });

  serviceType: string;

  @Output()
  create: EventEmitter<IServices.ICreate> = new EventEmitter<
    IServices.ICreate
  >();

  @Output()
  update: EventEmitter<IServices.IDocument> = new EventEmitter<
    IServices.IDocument
  >();

  @Output()
  loaded: EventEmitter<IServices.IDocument> = new EventEmitter<
    IServices.IDocument
  >();

  @Output() branchChange = new EventEmitter();

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
      'Redo'
    ]
  };

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.selectedBranch && changes.selectedBranch.currentValue) {
      this.branchUuid.patchValue(this.selectedBranch.uuid);
    }

    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    }

    if (changes.service && changes.service.currentValue) {
      this.loaded.emit(this.service);

      const {
        title,
        subtitle,
        flatRateUnit,
        description,
        pricing,
        appointment,
        type,
        tax
      } = this.service;

      // if (this.types[type] === IServices.Category.LABOUR) {
      //   this.pricing.enable();
      // } else {
      //   this.pricing.disable();
      // }

      let pricingValue = {};

      if (pricing && pricing.type === this.pricingTypes.NORMAL) {
        pricingValue = {
          type: pricing.type,
          unitBuyingPriceNormal: pricing.unitBuyingPrice,
          recommendedRetailPriceNormal: pricing.recommendedRetailPrice
        };
      }

      if (pricing && pricing.type === this.pricingTypes.RIM_SIZE) {
        pricingValue = {
          type: pricing.type,
          unitBuyingPriceRim: pricing.unitBuyingPrice,
          recommendedRetailPriceRim: pricing.recommendedRetailPrice
        };
      }

      if (pricing && pricing.type === this.pricingTypes.BODY_STYLE) {
        pricingValue = {
          type: pricing.type,
          unitBuyingPriceBody: pricing.unitBuyingPrice,
          recommendedRetailPriceBody: pricing.recommendedRetailPrice
        };
      }

      const patchValue = {
        title,
        subtitle,
        flatRateUnit,
        description,
        type,
        pricing: pricingValue,
        tax: tax * 100
      };
      this.form.patchValue(patchValue);

      if (appointment) {
        this.appointment.patchValue(appointment);
      }

      const pricingType = this.pricing.get('type').value;

      if (pricingType === this.pricingTypes.NORMAL) {
        this.pricing.get('unitBuyingPriceNormal').enable();
        this.pricing.get('recommendedRetailPriceNormal').enable();

        this.pricing.get('unitBuyingPriceRim').disable();
        this.pricing.get('recommendedRetailPriceRim').disable();
        this.pricing.get('unitBuyingPriceBody').disable();
        this.pricing.get('recommendedRetailPriceBody').disable();
      } else if (pricingType === this.pricingTypes.BODY_STYLE) {
        this.pricing.get('unitBuyingPriceBody').enable();
        this.pricing.get('recommendedRetailPriceBody').enable();

        this.pricing.get('unitBuyingPriceNormal').disable();
        this.pricing.get('recommendedRetailPriceNormal').disable();
        this.pricing.get('unitBuyingPriceRim').disable();
        this.pricing.get('recommendedRetailPriceRim').disable();
      } else if (pricingType === this.pricingTypes.RIM_SIZE) {
        this.pricing.get('unitBuyingPriceRim').enable();
        this.pricing.get('recommendedRetailPriceRim').enable();

        this.pricing.get('unitBuyingPriceNormal').disable();
        this.pricing.get('recommendedRetailPriceNormal').disable();
        this.pricing.get('unitBuyingPriceBody').disable();
        this.pricing.get('recommendedRetailPriceBody').disable();
      }

      this.exists = true;

      this.form.disable();
    }
  }

  saveService(form: FormGroup) {
    const { valid, value, touched } = form;
  }

  createService(event: boolean) {
    if (event) {
      const { valid, value, touched } = this.form;

      let pringObj = {};

      if (value.pricing) {
        if (value.pricing.type === this.pricingTypes.NORMAL) {
          pringObj = this.changeForm(
            value.pricing.unitBuyingPriceNormal,
            value.pricing.recommendedRetailPriceNormal
          );
        }
        if (value.pricing.type === this.pricingTypes.RIM_SIZE) {
          pringObj = this.changeForm(
            value.pricing.unitBuyingPriceRim,
            value.pricing.recommendedRetailPriceRim
          );
        }
        if (value.pricing.type === this.pricingTypes.BODY_STYLE) {
          pringObj = this.changeForm(
            value.pricing.unitBuyingPriceBody,
            value.pricing.recommendedRetailPriceBody
          );
        }

        if (valid && touched && this.createPermission) {
          const tax = value.tax / 100;

          this.create.emit({
            ...value,
            tax,
            pricing: {
              type: value.pricing.type,
              ...pringObj
            }
          });

          this.form.disable();
        }
      } else {
        if (valid && touched) {
          const tax = value.tax / 100;

          this.create.emit({
            ...value,
            tax
          });

          this.form.disable();
        }
      }
    }
  }

  updateService(event: boolean) {
    if (event) {
      const { valid, value, touched } = this.form;

      let pringObj = {};

      if (value.pricing) {
        if (value.pricing.type === this.pricingTypes.NORMAL) {
          pringObj = this.changeForm(
            value.pricing.unitBuyingPriceNormal,
            value.pricing.recommendedRetailPriceNormal
          );
        }
        if (value.pricing.type === this.pricingTypes.RIM_SIZE) {
          pringObj = this.changeForm(
            value.pricing.unitBuyingPriceRim,
            value.pricing.recommendedRetailPriceRim
          );
        }
        if (value.pricing.type === this.pricingTypes.BODY_STYLE) {
          pringObj = this.changeForm(
            value.pricing.unitBuyingPriceBody,
            value.pricing.recommendedRetailPriceBody
          );
        }

        if (valid && this.updatePermission) {
          const tax = value.tax / 100;

          delete value.branchUuid;
          delete value.corporateUuid;
          delete value.type;

          this.update.emit({
            ...this.service,
            ...value,
            tax,
            pricing: {
              type: value.pricing.type,
              ...pringObj
            }
          });

          this.form.disable();
        }
      } else {
        if (valid) {
          const tax = value.tax / 100;

          delete value.branchUuid;
          delete value.corporateUuid;
          delete value.type;

          this.update.emit({
            ...this.service,
            ...value,
            tax
          });

          this.form.disable();
        }
      }
    }
  }

  changeForm(unitBuyingPrice: any, recommendedRetailPrice: any) {
    return {
      unitBuyingPrice,
      recommendedRetailPrice
    };
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get branchUuid() {
    return this.form.get('branchUuid') as FormControl;
  }

  get title() {
    return this.form.get('title') as FormControl;
  }

  get subtitle() {
    return this.form.get('subtitle') as FormControl;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get flatRateUnit() {
    return this.form.get('flatRateUnit') as FormControl;
  }

  get description() {
    return this.form.get('description') as FormControl;
  }

  get pricing() {
    return this.form.get('pricing') as FormControl;
  }

  get appointment() {
    return this.form.get('appointment') as FormGroup;
  }

  get mobileService() {
    return this.appointment.get('mobileService') as FormControl;
  }

  get serviceCenter() {
    return this.appointment.get('serviceCenter') as FormControl;
  }

  get pricingGroup() {
    return {
      type: ['', Validators.required],
      unitBuyingPriceRim: this.fb.group(this.unitBuyingPriceRim),
      recommendedRetailPriceRim: this.fb.group(this.recommendedRetailPriceRim),

      unitBuyingPriceNormal: this.fb.group(this.unitBuyingPriceNormal),
      recommendedRetailPriceNormal: this.fb.group(
        this.recommendedRetailPriceNormal
      ),

      unitBuyingPriceBody: this.fb.group(this.unitBuyingPriceBody),
      recommendedRetailPriceBody: this.fb.group(this.recommendedRetailPriceBody)
    };
  }

  get unitBuyingPriceNormal() {
    return {
      NORMAL: ['', Validators.required]
    };
  }

  get recommendedRetailPriceNormal() {
    return {
      NORMAL: ['', Validators.required]
    };
  }

  get unitBuyingPriceBody() {
    return {
      LIGHT_WEIGHT: ['', Validators.required],
      MEDIUM_WEIGHT: ['', Validators.required],
      HEAVY_WEIGHT: ['', Validators.required]
    };
  }

  get recommendedRetailPriceBody() {
    return {
      LIGHT_WEIGHT: ['', Validators.required],
      MEDIUM_WEIGHT: ['', Validators.required],
      HEAVY_WEIGHT: ['', Validators.required]
    };
  }

  get unitBuyingPriceRim() {
    return {
      SMALL: ['', Validators.required],
      MEDIUM: ['', Validators.required],
      LARGE: ['', Validators.required]
    };
  }

  get recommendedRetailPriceRim() {
    return {
      SMALL: ['', Validators.required],
      MEDIUM: ['', Validators.required],
      LARGE: ['', Validators.required]
    };
  }

  selectType(event: MatSelectChange) {
    const { value } = event;

    if (this.types[value] === IServices.Category.LABOUR) {
      this.pricing.enable();
    } else {
      this.pricing.disable();
    }
  }

  generalValidation() {
    if (
      this.title.valid &&
      this.subtitle.valid &&
      this.type.valid &&
      this.description.valid
    ) {
      return true;
    }
    return false;
  }

  onResetForm(event) {
    if (event) {

      this.form.enable();

      this.editable = true;

      const {
        title,
        subtitle,
        flatRateUnit,
        description,
        pricing,
        appointment,
        tax,
        type
      } = this.service;

      let pricingValue = {};

      if (pricing && pricing.type === this.pricingTypes.NORMAL) {
        pricingValue = {
          type: pricing.type,
          unitBuyingPriceNormal: pricing.unitBuyingPrice,
          recommendedRetailPriceNormal: pricing.recommendedRetailPrice
        };
      }
      if (pricing && pricing.type === this.pricingTypes.RIM_SIZE) {
        pricingValue = {
          type: pricing.type,
          unitBuyingPriceRim: pricing.unitBuyingPrice,
          recommendedRetailPriceRim: pricing.recommendedRetailPrice
        };
      }
      if (pricing && pricing.type === this.pricingTypes.BODY_STYLE) {
        pricingValue = {
          type: pricing.type,
          unitBuyingPriceBody: pricing.unitBuyingPrice,
          recommendedRetailPriceBody: pricing.recommendedRetailPrice
        };
      }

      const patchValue = {
        title,
        subtitle,
        flatRateUnit,
        description,
        type,
        tax: tax * 100,
        pricing: pricingValue
      };

      this.form.patchValue(patchValue);

      if (appointment) {
        this.appointment.patchValue(appointment);
      }

      const pricingType = this.pricing.get('type').value;

      if (this.types[this.type.value] === IServices.Category.LABOUR) {
        this.pricing.enable();
      } else {
        this.pricing.disable();
      }

      if (pricingType === this.pricingTypes.NORMAL) {
        this.pricing.get('unitBuyingPriceNormal').enable();
        this.pricing.get('recommendedRetailPriceNormal').enable();

        this.pricing.get('unitBuyingPriceRim').disable();
        this.pricing.get('recommendedRetailPriceRim').disable();
        this.pricing.get('unitBuyingPriceBody').disable();
        this.pricing.get('recommendedRetailPriceBody').disable();
      } else if (pricingType === this.pricingTypes.BODY_STYLE) {
        this.pricing.get('unitBuyingPriceBody').enable();
        this.pricing.get('recommendedRetailPriceBody').enable();

        this.pricing.get('unitBuyingPriceNormal').disable();
        this.pricing.get('recommendedRetailPriceNormal').disable();
        this.pricing.get('unitBuyingPriceRim').disable();
        this.pricing.get('recommendedRetailPriceRim').disable();
      } else if (pricingType === this.pricingTypes.RIM_SIZE) {
        this.pricing.get('unitBuyingPriceRim').enable();
        this.pricing.get('recommendedRetailPriceRim').enable();

        this.pricing.get('unitBuyingPriceNormal').disable();
        this.pricing.get('recommendedRetailPriceNormal').disable();
        this.pricing.get('unitBuyingPriceBody').disable();
        this.pricing.get('recommendedRetailPriceBody').disable();
      }

      this.type.disable();
      this.corporateUuid.disable();
      this.branchUuid.disable();

      this.exists = true;
    } else {
      if (this.exists) {
        this.form.reset();
        this.loaded.emit(this.service);

        const {
          title,
          subtitle,
          flatRateUnit,
          description,
          pricing,
          appointment,
          type,
          tax
        } = this.service;

        if (this.types[type] === IServices.Category.LABOUR) {
          this.pricing.enable();
        } else {
          this.pricing.disable();
        }

        let pricingValue = {};

        if (pricing && pricing.type === this.pricingTypes.NORMAL) {
          pricingValue = {
            type: pricing.type,
            unitBuyingPriceNormal: pricing.unitBuyingPrice,
            recommendedRetailPriceNormal: pricing.recommendedRetailPrice
          };
        }
        if (pricing && pricing.type === this.pricingTypes.RIM_SIZE) {
          pricingValue = {
            type: pricing.type,
            unitBuyingPriceRim: pricing.unitBuyingPrice,
            recommendedRetailPriceRim: pricing.recommendedRetailPrice
          };
        }
        if (pricing && pricing.type === this.pricingTypes.BODY_STYLE) {
          pricingValue = {
            type: pricing.type,
            unitBuyingPriceBody: pricing.unitBuyingPrice,
            recommendedRetailPriceBody: pricing.recommendedRetailPrice
          };
        }

        const patchValue = {
          title,
          subtitle,
          flatRateUnit,
          description,
          type,
          pricing: pricingValue,
          tax: tax * 100
        };

        this.form.patchValue(patchValue);

        if (appointment) {
          this.appointment.patchValue(appointment);
        }

        const pricingType = this.pricing.get('type').value;

        if (pricingType === this.pricingTypes.NORMAL) {
          this.pricing.get('unitBuyingPriceNormal').enable();
          this.pricing.get('recommendedRetailPriceNormal').enable();

          this.pricing.get('unitBuyingPriceRim').disable();
          this.pricing.get('recommendedRetailPriceRim').disable();
          this.pricing.get('unitBuyingPriceBody').disable();
          this.pricing.get('recommendedRetailPriceBody').disable();
        } else if (pricingType === this.pricingTypes.BODY_STYLE) {
          this.pricing.get('unitBuyingPriceBody').enable();
          this.pricing.get('recommendedRetailPriceBody').enable();

          this.pricing.get('unitBuyingPriceNormal').disable();
          this.pricing.get('recommendedRetailPriceNormal').disable();
          this.pricing.get('unitBuyingPriceRim').disable();
          this.pricing.get('recommendedRetailPriceRim').disable();
        } else if (pricingType === this.pricingTypes.RIM_SIZE) {
          this.pricing.get('unitBuyingPriceRim').enable();
          this.pricing.get('recommendedRetailPriceRim').enable();

          this.pricing.get('unitBuyingPriceNormal').disable();
          this.pricing.get('recommendedRetailPriceNormal').disable();
          this.pricing.get('unitBuyingPriceBody').disable();
          this.pricing.get('recommendedRetailPriceBody').disable();
        }

        this.exists = true;

        this.form.disable();
      } else {
        this.location.back();
      }
    }
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

  getErrorMessage() {
    return this.description.hasError('required')
      ? 'This field is required'
      : '';
  }
}
