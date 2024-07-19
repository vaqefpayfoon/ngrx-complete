import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
// Models
import { IPurchases } from '../../../models';
// angular forms
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IModels } from '@neural/modules/models';
import { MatSelectChange } from '@angular/material/select';

//Permission
import { permissionTags } from '@neural/shared/data';

import { traverseAndRemove } from '../../../functions';

import { ValidationService } from '@neural/ui';
@Component({
  selector: 'neural-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: [
    './customer-details.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
})
export class CustomerDetailsComponent implements OnChanges, OnInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() unit: IModels.IUnitList;

  @Input() permissions: any;

  @Output() brandSeriesChanges = new EventEmitter<{
    brand: string;
    series: string;
  }>();

  @Output() modelBrandSeriesChanges = new EventEmitter<IModels.IVariant>();

  @Output() bagdeChanges = new EventEmitter<IPurchases.IUpdateBadge>();

  @Output() update = new EventEmitter<IPurchases.IUpdate>();

  form: FormGroup;

  unitForm: FormGroup;

  purchaseDetail = true;

  exists = false;

  constructor(private fb: FormBuilder) {
    this.form = this.initCustomerDetailForm();
    this.unitForm = this.initUnitForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.purchase && changes.purchase.currentValue) {
      const { model } = this.purchase;
      this.brandSeriesChanges.emit({
        brand: model?.unit?.brand,
        series: model?.unit?.series,
      });
      this.modelBrandSeriesChanges.emit({
        brand: model?.unit?.brand,
        series: model?.unit?.series,
        model: model?.unit?.model,
      });

      this.purchaseDetail = true;
    }

    if (
      this.unit &&
      this.unit.brandsAndSeries &&
      this.unit.models &&
      this.unit.variants &&
      this.purchase &&
      !this.exists
    ) {
      const {
        payment,
        model: { unit, exterior, interior },
        numberPlate,
      } = this.purchase;
      const modelObject = this.unit?.models?.find(
        (item) => item.actualModel === unit.actualModel
      );

      this.unitForm.patchValue({
        brand: unit.brand,
        series: unit.series,
        model: modelObject,
        variant: unit.variant,
        interiorColor: interior?.color?.name,
        exteriorColor: exterior?.color?.name,
      });

      let patchForm: IPurchases.IUpdate = {
        model: {
          uuid: modelObject?.uuid,
          interiorColor: interior?.color?.name,
          exteriorColor: exterior?.color?.name,
        },
        numberPlate: numberPlate,
      };

      if (this.updateQuotePermission) {
        patchForm = {
          ...patchForm,
          payment: {
            payableAmount: payment?.payableAmount,
            receiptId: payment?.receiptId,
          },
        };
      }

      this.form.patchValue(patchForm);

      this.exists = true;
    }
  }

  ngOnInit(): void {}

  private initUnitForm(): FormGroup {
    return this.fb.group({
      brand: ['', Validators.compose([Validators.required])],
      series: ['', Validators.compose([Validators.required])],
      model: ['', Validators.compose([Validators.required])],
      variant: ['', Validators.compose([Validators.required])],
      interiorColor: [''],
      exteriorColor: ['', Validators.compose([Validators.required])],
    });
  }

  private initCustomerDetailForm(): FormGroup {
    return this.fb.group({
      model: this.initModelForm(),
      payment: this.initPaymentForm(),
      numberPlate: [
        '',
        Validators.compose([
          Validators.maxLength(30),
          ValidationService.alphanumeric,
        ]),
      ],
    });
  }

  private initModelForm(): FormGroup {
    return this.fb.group({
      uuid: [''],
      interiorColor: [''],
      exteriorColor: [''],
    });
  }

  private initPaymentForm(): FormGroup {
    return this.fb.group({
      payableAmount: [''],
      receiptId: [''],
    });
  }

  onSeriesChange(event: MatSelectChange): void {
    const { value } = event;
    this.brandSeriesChanges.emit({ brand: this.brand.value, series: value });
  }

  onModelChange(event: MatSelectChange): void {
    const { value } = event;
    const fromModelBrand = this.formModel.get('uuid') as FormControl;
    fromModelBrand.patchValue(value.uuid);
    this.onResetUnitFormModel();
    this.modelBrandSeriesChanges.emit({
      brand: this.brand.value,
      series: this.series.value,
      model: value.actualModel,
    });
  }

  onColorChange(
    name: 'exteriorColor' | 'interiorColor',
    event: MatSelectChange
  ): void {
    const { value } = event;
    const fromModelBrand = this.formModel.get(name) as FormControl;
    fromModelBrand.patchValue(value);
  }

  onResetUnitForm(): void {
    this.series.reset();
    this.model.reset();
    this.variant.reset();
    this.interiorColor.reset();
    this.exteriorColor.reset();
  }

  onResetUnitFormModel(): void {
    this.variant.reset();
    this.interiorColor.reset();
    this.exteriorColor.reset();
  }

  get formDisabled(): boolean {
    return this.unitForm.disabled;
  }

  get numberPlate(): FormControl {
    return this.form.get('numberPlate') as FormControl;
  }

  get formModel(): FormControl {
    return this.form.get('model') as FormControl;
  }

  get brand(): FormControl {
    return this.unitForm.get('brand') as FormControl;
  }

  get series(): FormControl {
    return this.unitForm.get('series') as FormControl;
  }

  get model(): FormControl {
    return this.unitForm.get('model') as FormControl;
  }

  get variant(): FormControl {
    return this.unitForm.get('variant') as FormControl;
  }

  get interiorColor(): FormControl {
    return this.unitForm.get('interiorColor') as FormControl;
  }

  get exteriorColor(): FormControl {
    return this.unitForm.get('exteriorColor') as FormControl;
  }

  get seriesList(): IModels.ISeries[] | string[] | null {
    if (this.brand.valid) {
      const index = this.unit?.brandsAndSeries?.findIndex(
        (x) => x.name === this.brand.value
      );

      if (index !== -1) {
        return this.unit?.brandsAndSeries
          ? this.unit?.brandsAndSeries[index]?.series
          : null;
      }
    }
    return null;
  }

  get exteriorList(): IModels.IGalleryDetail[] | string[] | null {
    if (this.variant.valid) {
      const index = this.unit?.variants?.findIndex(
        (x) => x?.unit?.variant === this.variant.value
      );

      if (index !== -1) {
        return this.unit?.variants
          ? this.unit?.variants[index]?.gallery?.exterior
          : null;
      }
    }
    return null;
  }

  get interiorList(): IModels.IGalleryDetail[] | string[] | null {
    if (this.variant.valid) {
      const index = this.unit?.variants?.findIndex(
        (x) => x?.unit?.variant === this.variant.value
      );

      if (index !== -1) {
        return this.unit.variants
          ? this.unit.variants[index]?.gallery?.interior
          : null;
      }
    }
    return null;
  }

  onClearBadge() {
    const payload: IPurchases.IUpdateBadge = {
      uuid: this.purchase.uuid,
      section: IPurchases.BadgeSection.PURCHASE,
    };

    this.bagdeChanges.emit(payload);
  }

  onUpdate(form: FormGroup): void {
    const { value, valid } = form;

    if (valid) {
      traverseAndRemove(value);

      this.purchaseDetail = !this.purchaseDetail;
      this.update.emit(value);

      this.exists = false;
    }
  }

  compareFn(c1: IModels.IModel, c2: IModels.IModel): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  get updatePermission() {
    if (this.permissions && this.permissions[permissionTags.Sale.UPDATE_SALE]) {
      return true;
    }
    return false;
  }

  get updateQuotePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.UPDATE_PURCHASE_QUOTE]
    ) {
      return true;
    }
    return false;
  }
}
