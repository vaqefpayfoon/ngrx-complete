import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';

// Model
import { IDashboard } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-basic-dashboard',
  templateUrl: './basic-dashboard.component.html',
  styleUrls: ['./basic-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDashboardComponent {
  @Input() basic: IDashboard.IBasic;

  @Input() loading: boolean;

  @Input() error: any;

  @Input() permissions: any;

  constructor() {}

  get indicatorTypes() {
    return IDashboard.IndicatorTypes;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Analytic.BASIC_DASHBOARD]
    ) {
      return true;
    }
    return false;
  }
}
