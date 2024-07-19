import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Models
import { IBranches } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-branch-card',
  templateUrl: './branch-card.component.html',
  styleUrls: ['./branch-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchCardComponent implements OnInit {
  @Input() branch: IBranches.IDocument;

  @Input() permissions: any;

  @Input() totalBranches = 5;

  @Output() ordered = new EventEmitter<IBranches.IDocument>();

  constructor() {}

  ngOnInit() {}

  get image() {
    return this.branch.image;
  }

  get name() {
    return this.branch.name;
  }

  get orders() {
    return Array.from(Array(this.totalBranches).keys(), n => n + 1);
  }

  get uuid() {
    return this.branch.uuid;
  }

  get couuid() {
    return this.branch.corporateUuid;
  }

  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.GET_BRANCH]
    ) {
      return true;
    }
    return false;
  }

  reOrder(order: number) {
    this.ordered.emit({
      ...this.branch,
      order
    });
  }
}
