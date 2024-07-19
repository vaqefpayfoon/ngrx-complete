import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

// Models
import { IModels } from '../../models';
import { Auth } from '@neural/auth';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Functions
import { traverseAndRemove } from '@neural/shared/data';

// Location for Back button
import { Location } from '@angular/common';

// Material Event
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'neural-model-image-form',
  templateUrl: './model-image-form.component.html',
  styleUrls: ['./model-image-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelImageFormComponent implements OnChanges {
  @Input() model: IModels.IDocument;

  @Input() unit: IModels.IUnitList;

  @Input() currentModelImageUrl: {
    url: {
      [name: string]: string;
    };
    index: number;
  };

  @Input() selectedCorporate: Auth.ICorporates;

  @Input() permissions: any;

  @Output() setModelImage = new EventEmitter<IModels.ISetModelImage>();

  @Output() seriesChange = new EventEmitter<{
    brand: string;
    series: string;
  }>();

  @Output() modelChange = new EventEmitter<{
    corporateUuid: string;
    brand: string;
    series: string;
    model: string;
    actualModel?: string;
  }>();

  @Output() update = new EventEmitter<{ payload: IModels.ISetSeriesImage }>();

  form = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    brand: ['', Validators.compose([Validators.required])],
    model: ['', Validators.compose([Validators.required])],
    series: ['', Validators.compose([Validators.required])],
    image: ['', Validators.compose([Validators.required])],
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    }

    if (changes.unit && changes.unit.currentValue) {
      this.image.reset();
    }
  }

  get brand() {
    return this.form.get('brand') as FormControl;
  }

  get series() {
    return this.form.get('series') as FormControl;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get image() {
    return this.form.get('image') as FormControl;
  }

  get variants() {
    return this.unit.variants.reduce((variant, curr) => {
      const images = curr.gallery.exterior.reduce((url, curUrl) => {
        url = [...curUrl.images];
        return url;
      }, []);

      const object = {
        name: curr.unit.variant,
        images,
      };

      variant.push(object);

      return variant;
    }, []);
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get seriesList(): IModels.ISeries[] | string[] {
    const brand = this.form.get('brand') as FormControl;

    if (brand.valid) {
      const index = this.unit.brandsAndSeries.findIndex(
        (x) => x.name === brand.value
      );

      if (index !== -1) {
        return this.unit.brandsAndSeries[index].series;
      }
    }

    return [];
  }

  create(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.createPermission) {
      traverseAndRemove(value);
      this.setModelImage.emit({ ...value, model: value?.model?.actualModel });
      form.disable();
    }
  }

  onChangeSeries(event: MatSelectChange) {
    const { value } = event;
    const brand = this.brand.value;
    this.seriesChange.emit({ brand, series: value });
  }

  onChangeModel(event: MatSelectChange) {
    const { value } = event;
    const brand = this.brand.value;
    const series = this.series.value;
    const corporateUuid = this.corporateUuid.value;
    this.modelChange.emit({
      corporateUuid,
      brand,
      series,
      model: value?.name,
      actualModel: value?.actualModel,
    });

    this.currentModelImageUrl = null;
  }

  cancel() {
    return this.location.back();
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
}
