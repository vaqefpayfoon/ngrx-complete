import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

// Models
import { IWarranties } from '../../models';

@Component({
  selector: 'neural-reminders-reports',
  templateUrl: './reminders-reports.component.html',
  styleUrls: ['./reminders-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersReportsComponent {

  @Input() reports: {
    warranties: IWarranties.IJob;
  } |  null;

  constructor() { }

}
