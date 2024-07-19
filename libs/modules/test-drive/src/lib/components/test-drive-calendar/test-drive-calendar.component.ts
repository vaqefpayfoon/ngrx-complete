import {
  Component,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const SLOT_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TestDriveCalendarComponent),
  multi: true,
};

// Model
import { ITestDrives } from '../../models';

@Component({
  selector: 'neural-test-drive-calendar',
  templateUrl: './test-drive-calendar.component.html',
  styleUrls: ['./test-drive-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SLOT_ACCESSOR],
})
export class TestDriveCalendarComponent implements ControlValueAccessor, OnInit {
  @Input() timeZone: string;

  @Input() calendars: ITestDrives.ITestDriveCalendar[];

  @Input() formDisabled: boolean;
  @Input() isPreOwned: boolean;

  @Output() selected = new EventEmitter();

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

  selectDate(date: string) {
    if (!this.formDisabled) {
      this.value = date;

      this.selected.emit(date);
      this.onTouch();
      this.onModelChange(this.value);
    }

    return false;
  }

  constructor() {}
  ngOnInit(): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }
}
