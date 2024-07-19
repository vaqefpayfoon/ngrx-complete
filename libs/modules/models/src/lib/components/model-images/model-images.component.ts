import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const MODEL_IMAGES_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ModelImagesComponent),
  multi: true
};

// interface
import { IModels } from '../../models';

@Component({
  selector: 'neural-model-images',
  templateUrl: './model-images.component.html',
  styleUrls: ['./model-images.component.scss'],
  providers: [MODEL_IMAGES_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelImagesComponent implements ControlValueAccessor {
  @Input()
  loading: boolean;

  @Input()
  error: any;

  @Input()
  formDisabled: boolean;

  @Input() variants: IModels.IDocument[] = [];

  value: string;

  onModelChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouch = fn;
  }

  writeValue(value: string) {
    this.value = value;
  }

  selectImage(url: string) {
    if (!this.formDisabled) {
      this.value = url;

      this.onTouch();
      this.onModelChange(this.value);
    }

    return false;
  }

  constructor() {}
}
