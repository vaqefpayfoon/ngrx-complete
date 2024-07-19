import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

// Angular forms
import {
  FormArray,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

// Models
import { IModels } from '../../models';
import { Auth } from '@neural/auth';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-series-image',
  templateUrl: './model-series-image.component.html',
  styleUrls: ['./model-series-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelSeriesImageComponent implements OnChanges {
  @Input() model: IModels.IDocument;

  @Input() brandAndSeries: IModels.IBrand[];

  @Input() selectedCorporate: Auth.ICorporates;

  @Input() permissions: any;

  @Output() create = new EventEmitter<IModels.ISetSeriesImage>();

  form = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    brand: ['', Validators.compose([Validators.required])],
    series: ['', Validators.compose([Validators.required])],
    image: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    }
  }

  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.image.patchValue(file);

    this.image.updateValueAndValidity();
  }

  createSeriesImage(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
      form.disable();
    }
  }

  get brand() {
    return this.form.get('brand') as FormControl;
  }

  get image() {
    return this.form.get('image') as FormControl;
  }

  get series() {
    return this.form.get('series') as FormControl;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get seriesList(): IModels.ISeries[] | string[] {
    const brand = this.form.get('brand') as FormControl;

    if (brand.valid) {
      const index = this.brandAndSeries.findIndex(x => x.name === brand.value);

      if (index !== -1) {
        return this.brandAndSeries[index].series;
      }
    }

    return [];
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
