import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output
} from '@angular/core';

// Angular forms
import { FormArray, FormGroup } from '@angular/forms';

import { ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-branch-calendar',
  templateUrl: './branch-calendar.component.html',
  styleUrls: ['./branch-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchCalendarComponent implements OnInit {
  @Input() permissions: any;

  @Input() parent: FormGroup;

  @Input() exists: boolean;

  @Input() corporate: ICorporates.IDocument;

  @Output() removed = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  get workshop(): FormArray {
    return <FormArray>this.parent.get('workshops');
  }

  get workshops() {
    return (<FormArray>this.parent.get('workshops')).controls;
  }

  get formDisabled() {
    return this.parent.disabled;
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

  onRemove(index: number) {
    if (this.workshops.length !== 0) {
      this.removed.emit(index);
    }
  }
}
