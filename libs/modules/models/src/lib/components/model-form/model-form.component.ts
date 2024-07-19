import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';

// Models
import { IModels } from '../../models';

// Auth
import { Auth } from '@neural/auth';

// Angular Form Builder
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';

// Location for Back button
import { Location } from '@angular/common';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

// facade
import { CarModelsFacade } from '../../+state/facades';
import { Observable } from 'rxjs';

// Functions
import { traverseAndRemove } from '@neural/shared/data';

import { ValidationService } from '@neural/ui';

@Component({
  selector: 'neural-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelFormComponent implements OnChanges, OnInit {
  @Input() model: IModels.IDocument;

  @Input() error: any;

  @Input() permissions: any;

  @Input() selectedCorporate: Auth.ICorporates;

  @Output()
  create: EventEmitter<IModels.ICreate> = new EventEmitter<IModels.ICreate>();

  @Output()
  update: EventEmitter<IModels.IDocument> = new EventEmitter<
    IModels.IDocument
  >();

  @Output() loaded: EventEmitter<IModels.IDocument> = new EventEmitter<
    IModels.IDocument
  >();

  @Output() updateBranches: EventEmitter<{
    model: IModels.IDocument;
    branches: IModels.ISetBranches;
  }> = new EventEmitter<{
    model: IModels.IDocument;
    branches: IModels.ISetBranches;
  }>();

  @Output() deleted = new EventEmitter<{ uuid: string; image: string }>();

  @Output() corporateChange = new EventEmitter<boolean>();

  tempGalleryImage$: Observable<{
    url: {
      [name: string]: string;
    };
    index: number;
  }>;

  exists = false;

  form = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    image: [''],
    unit: this.fb.group({
      brand: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],
      actualModel: ['', Validators.compose([Validators.required])],
      display: ['', Validators.compose([Validators.required])],
      variant: ['', Validators.compose([Validators.required])],
      actualVariant: ['', Validators.compose([Validators.required])],
      series: ['', Validators.compose([Validators.required])],
    }),
    type: ['', Validators.compose([Validators.required])],
    price: ['', Validators.compose([Validators.required])], // todo: validation for 0
    order: [''],
    brochures: this.fb.array([]),
    // loan: this.fb.group({
    //   minDownPayment: [''],
    //   period: this.fb.group({
    //     min: [''],
    //     max: [''],
    //   }),
    //   interestRate: [''],
    // }),
    loanLink: [''],
    specs: this.fb.array([this.createSpec()]),
    gallery: this.fb.group({
      interior: this.fb.array([]),
      exterior: this.fb.array([]),
    }),
    sales: this.fb.group({
      deposit: this.fb.group({
        type: [''],
        amount: [''],
      }),
      active: [false],
    }),
    promotion: this.fb.group({
      image: [''],
      title: [''],
      description: [''],
      discount: this.fb.group({
        type: [''],
        amount: [''],
      }),
    }),
  });

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private carModelsFacade: CarModelsFacade,
    private validationService: ValidationService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.setValue(this.selectedCorporate.uuid);
    }

    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }

    if (changes.model && changes.model.currentValue && this.model) {
      this._initialData();
    }
  }

  private _initialData() {
    this.exists = true;
    this.loaded.emit(this.model);

    this.form.patchValue(this.model);

    const { specs, gallery, brochures } = this.model;

    if (gallery) {
      if (!!gallery.interior) {
        this.emptyInterior();

        for (const item of gallery.interior) {
          this.addInterior(item);
        }
      }
      if (!!gallery.exterior) {
        this.emptyExterior();

        for (const item of gallery.exterior) {
          this.addExterior(item);
        }
      }
    }

    if (!!brochures) {
      this.emptyBrochure();

      for (const brochure of brochures) {
        this.addBrochure(brochure);
      }
    }

    if (!!specs) {
      this.emptySpecs();

      for (const spec of specs) {
        this.addSpecs(spec);
      }
    }

    this.form.disable();
  }

  ngOnInit() {
    this.tempGalleryImage$ = this.carModelsFacade.temp$;
  }

  emptyBrochure() {
    while (this.brochures.controls.length) {
      this.brochures.removeAt(0);
    }
  }

  createBrochure() {
    return this.fb.group({
      name: [''],
      link: [''],
    });
  }

  addBrochure(brochure?: IModels.IBrochure | any) {
    if (brochure) {
      const createBrochure = this.fb.group({
        name: [brochure.name],
        link: [brochure.link],
      });
      this.brochures.push(createBrochure);
    } else {
      return this.brochures.push(this.createBrochure());
    }
  }

  removeBrochure(event: number) {
    const control = this.form.get('brochures') as FormArray;
    return control.removeAt(event);
  }

  createSpec() {
    return this.fb.group({
      key: ['', Validators.compose([Validators.required])],
      value: ['', Validators.compose([Validators.required])],
    });
  }

  emptySpecs() {
    while (this.specs.controls.length) {
      this.specs.removeAt(0);
    }
  }

  addSpecs(spec?: IModels.ISpecs | any) {
    if (spec) {
      const createSpec = this.fb.group({
        key: [spec.key, Validators.compose([Validators.required])],
        value: [spec.value, Validators.compose([Validators.required])],
      });
      this.specs.push(createSpec);
    } else {
      return this.specs.push(this.createSpec());
    }
  }

  removeSpecs(event: number) {
    const control = this.form.get('specs') as FormArray;
    return control.removeAt(event);
  }

  onRemoveInterior(event: number) {
    const control = this.gallery.get('interior') as FormArray;
    return control.removeAt(event);
  }

  createInterior() {
    return this.fb.group({
      color: this.fb.group({
        name: ['', Validators.compose([Validators.required])],
        image: ['', Validators.compose([Validators.required])],
      }),
      images: ['', Validators.compose([Validators.required])],
    });
  }

  emptyInterior() {
    while (this.interior.controls.length) {
      this.interior.removeAt(0);
    }
  }

  addInterior(galleryDetail?: IModels.IGalleryDetail | any) {
    if (galleryDetail) {
      const createInterior = this.fb.group({
        color: this.fb.group({
          name: [
            galleryDetail.color.name,
            Validators.compose([Validators.required]),
          ],
          image: [
            galleryDetail.color.image,
            Validators.compose([Validators.required]),
          ],
        }),
        images: [
          [...galleryDetail.images],
          Validators.compose([Validators.required]),
        ],
      });
      this.interior.push(createInterior);
    } else {
      return this.interior.push(this.createInterior());
    }
  }

  removeExterior(event: number) {
    const control = this.gallery.get('exterior') as FormArray;
    return control.removeAt(event);
  }

  createExterior() {
    return this.fb.group({
      color: this.fb.group({
        name: ['', Validators.compose([Validators.required])],
        image: ['', Validators.compose([Validators.required])],
      }),
      images: ['', Validators.compose([Validators.required])],
    });
  }

  emptyExterior() {
    while (this.exterior.controls.length) {
      this.exterior.removeAt(0);
    }
  }

  addExterior(galleryDetail?: IModels.IGalleryDetail | any) {
    if (galleryDetail) {
      const createExterior = this.fb.group({
        color: this.fb.group({
          name: [
            galleryDetail.color.name,
            Validators.compose([Validators.required]),
          ],
          image: [
            galleryDetail.color.image,
            Validators.compose([Validators.required]),
          ],
        }),
        images: [
          [...galleryDetail.images],
          Validators.compose([Validators.required]),
        ],
      });
      this.exterior.push(createExterior);
    } else {
      return this.exterior.push(this.createExterior());
    }
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get image() {
    return this.form.get('image') as FormControl;
  }

  get unit() {
    return this.form.get('unit') as FormGroup;
  }

  get brochures() {
    return this.form.get('brochures') as FormArray;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get price() {
    return this.form.get('price') as FormControl;
  }

  get specs() {
    return this.form.get('specs') as FormArray;
  }

  get gallery() {
    return this.form.get('gallery') as FormGroup;
  }

  get interior() {
    return this.gallery.get('interior') as FormArray;
  }

  get exterior() {
    return this.gallery.get('exterior') as FormArray;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get types() {
    return IModels.VehicleType;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.CREATE_MODEL]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.UPDATE_MODEL]
    ) {
      return true;
    }
    return false;
  }

  get enabledGeneralForm() {
    if (!this.exists) {
      return (
        this.corporateUuid.valid &&
        this.unit.valid &&
        this.type.valid &&
        this.price.valid &&
        !this.formDisabled &&
        this.createPermission &&
        this.updatePermission
      );
    }
    return this.form.valid;
  }

  toggleModel(form: FormGroup) {
    const { controls } = form;
    if (
      controls.unit.valid &&
      controls.type.valid &&
      controls.price.valid &&
      !this.exists
    ) {
      this.exists = true;
    } else {
      if (!!this.model) {
        return this.updateModel(true, form);
      }
      return this.createModel(true, form);
    }
  }

  onAction(action: string) {
    switch (action) {
      case 'edit':
        this.form.enable();
        break;
      case 'cancel':
        this.cancel();
        break;
    }
  }

  updateModelImage(event: IModels.IDocument) {
    if (!!event) {
      this.update.emit(event);
    }
  }

  cancel() {
    if (!this.model) {
      this.location.back();
    } else {
      this._initialData();
    }
  }

  createModel(event: boolean, form: FormGroup) {
    const { value, valid } = form;

    this.validationService.validateAllFormFields(form);
    form.markAsDirty();
    form.markAllAsTouched();

    if (!!value && !!value.sales && !value.deposit) {
      value.sales.active = '';
    }

    if (event && valid && this.createPermission) {
      traverseAndRemove(value);
      this.create.emit(value);
      form.disable();
    }
  }

  updateModel(event: boolean, form: FormGroup) {
    const { valid, value } = form;

    this.validationService.validateAllFormFields(form);

    if (event && valid && this.updatePermission) {
      const updateDocument = {
        ...this.model,
        ...value,
      };

      traverseAndRemove(updateDocument);
      this.update.emit(updateDocument);

      this.form.disable();
    }
  }

  uploadInteriorGalleryColorImage({
    model,
    index,
  }: {
    model: IModels.IFile;
    index: number;
  }) {
    this.carModelsFacade.onUploadInteriorGalleryColorImage(model, index);
  }

  uploadExteriorGalleryColorImage({
    model,
    index,
  }: {
    model: IModels.IFile;
    index: number;
  }) {
    this.carModelsFacade.onUploadExteriorGalleryColorImage(model, index);
  }

  uploadInteriorGalleryImages({
    model,
    index,
  }: {
    model: IModels.IFile;
    index: number;
  }) {
    this.carModelsFacade.onUploadInteriorGalleryImages(model, index);
  }

  uploadExteriorGalleryImages({
    model,
    index,
  }: {
    model: IModels.IFile;
    index: number;
  }) {
    this.carModelsFacade.onUploadExteriorGalleryImages(model, index);
  }

  setBranches(branches: IModels.ISetBranches) {
    const model = this.model;

    const payload: {
      model: IModels.IDocument;
      branches: IModels.ISetBranches;
    } = {
      model,
      branches,
    };
    traverseAndRemove(payload);
    this.updateBranches.emit(payload);
  }

  onRemoveGalleryImage({ image }: { image: string }) {
    if (!!image) {
      const { uuid } = this.model;
      this.deleted.emit({ uuid, image });
    }
  }
}
