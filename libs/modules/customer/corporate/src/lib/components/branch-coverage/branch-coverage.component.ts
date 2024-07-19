import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Angular Form Builder
import {
  FormControl,
  FormGroup
} from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Models
import { IBranches } from '../../models';

@Component({
  selector: 'neural-branch-coverage',
  templateUrl: './branch-coverage.component.html',
  styleUrls: ['./branch-coverage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchCoverageComponent implements OnChanges {
  @Input() permissions: any;

  @Input() parent: FormGroup;
  @Input() exists;

  @Input() branch: IBranches.IDocument;

  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();
  @Output() action = new EventEmitter<string>();

  visible = true;

  selectable = true;

  removable = true;

  addOnBlur = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  mobileServicecoverages: string[] = [];
  testDrivecoverages: string[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.branch && changes.branch.currentValue) {
      if (!!this.branch?.mapCoveragePostalCodes?.mobileService) {
        this.mobileServicecoverages.push(
          ...this.branch?.mapCoveragePostalCodes?.mobileService
        );
      }

      if (!!this.branch?.mapCoveragePostalCodes?.testDrive) {
        this.testDrivecoverages.push(
          ...this.branch?.mapCoveragePostalCodes?.testDrive
        );
      }
    }
  }

  add(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our divisions
    if ((value || '').trim()) {
      this.mobileServicecoverages.push(value.trim());
      this.mobileServiceControl(this.mobileServicecoverages);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(coverage: string): void {
    const index = this.mobileServicecoverages.indexOf(coverage);

    if (index >= 0) {
      this.mobileServicecoverages.splice(index, 1);

      this.mobileServiceControl(this.mobileServicecoverages);
    }
  }

  private mobileServiceControl(array: string[]) {
    const mobileService = <FormControl>this.mapCoverage.get('mobileService');

    const value = array.length === 0 ? [] : [...array];

    mobileService.patchValue(value);

    this.parent.updateValueAndValidity();
  }

  addTestDrive(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our divisions
    if ((value || '').trim()) {
      this.testDrivecoverages.push(value.trim());
      this.testDriveControl(this.testDrivecoverages);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTestDrive(coverage: string): void {
    const index = this.testDrivecoverages.indexOf(coverage);

    if (index >= 0) {
      this.testDrivecoverages.splice(index, 1);

      this.testDriveControl(this.testDrivecoverages);
    }
  }

  private testDriveControl(array: string[]) {
    const testDrive = <FormControl>this.mapCoverage.get('testDrive');

    const value = array.length === 0 ? [] : [...array];

    testDrive.patchValue(value);

    this.parent.updateValueAndValidity();
  }

  get mapCoverage(): FormGroup {
    return <FormGroup>this.parent.get('mapCoveragePostalCodes');
  }

  onAction(action: string) {
    this.action.emit(action);
  }

  get formDisabled() {
    return this.parent.disabled;
  }

  onSave(form: FormGroup) {
    // Check it've saved
    if (this.branch && this.branch.uuid) {
      // create new people In Charges
      if (form.valid) {
        this.updated.emit(form.valid);
      }
    } else {
      // Update new people In Charges
      if (form.valid) {
        this.created.emit(form.valid);
      }
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.CREATE_BRANCH]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.UPDATE_BRANCH]
    ) {
      return true;
    }
    return false;
  }
}
