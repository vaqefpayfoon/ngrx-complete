import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';

// Angular Form Builder
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

//Models
import { ISales } from '../../../models';

//Permission
import { permissionTags } from '@neural/shared/data';

const CUSTOM_INPUT_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TradeInFileComponent),
  multi: true,
};

@Component({
  selector: 'neural-tradeIn-file',
  templateUrl: './tradeIn-file.component.html',
  styleUrls: ['./tradeIn-file.component.scss'],
  providers: [CUSTOM_INPUT_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeInFileComponent implements ControlValueAccessor {
  @Input() formDisabled: boolean;

  @Input() permissions: any;

  @Input() title: ISales.TradeInUploadTitleType;

  @Output() remove = new EventEmitter<any>();

  constructor() {}

  value: string;

  onChange: any = () => {};

  onTouch: any = () => {};

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouch = fn;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  removeFile(): void {
    this.remove.emit();
  }

  get deleteDocumentPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.DELETE_SALE_DOCUMENT]
    ) {
      return true;
    }
    return false;
  }
}
