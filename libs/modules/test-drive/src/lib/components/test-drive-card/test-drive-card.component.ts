import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Model
import { ITestDrives } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-test-drive-card',
  templateUrl: './test-drive-card.component.html',
  styleUrls: ['./test-drive-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestDriveCardComponent {
  @Input() timeZone: string;
  
  @Input() disabled: boolean;

  @Input() testDrive: ITestDrives.IDocument;

  @Input() permissions: any;

  @Output() cancelChange = new EventEmitter<ITestDrives.IDocument>();

  @Output() completeChange = new EventEmitter<ITestDrives.IDocument>();

  private _showSelectedSlots = false;
  public get showSelectedSlots(): boolean {
    return this._showSelectedSlots;
  }
  public set showSelectedSlots(value: boolean) {
    this._showSelectedSlots = value;
  }

  constructor() {}

  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.TestDrive.GET_TEST_DRIVE]
    ) {
      return true;
    }
    return false;
  }

  get cancelPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.TestDrive.CANCEL_TEST_DRIVE]
    ) {
      return true;
    }
    return false;
  }

  get completePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.TestDrive.COMPLETE_TEST_DRIVE]
    ) {
      return true;
    }
    return false;
  }

  get cancel() {
    if (
      this.testDrive?.status !== ITestDrives.Statuses.COMPLETED &&
      this.testDrive?.status !== ITestDrives.Statuses.CANCELLED
    ) {
      return true;
    }
    return false;
  }

  get complete() {
    if (
      this.testDrive?.status !== ITestDrives.Statuses.CANCELLED &&
      this.testDrive?.status !== ITestDrives.Statuses.COMPLETED
    ) {
      return true;
    }
    return false;
  }

  cancelTestDrive(testDrive: ITestDrives.IDocument) {
    if (this.cancelPermission && this.cancel) {
      return this.cancelChange.emit(testDrive);
    }
    return false;
  }

  compeleteTestDrive(testDrive: ITestDrives.IDocument) {
    if (this.completePermission && this.complete) {
      this.completeChange.emit(testDrive);
    }
    return false;
  }
}
