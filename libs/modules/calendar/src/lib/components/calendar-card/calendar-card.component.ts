import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

// Calendars
import { ICalendars } from '../../models';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'neural-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCardComponent implements OnInit {
  @Input() calendar: ICalendars.IDocument;

  @Input() selectedDate: _moment.Moment;

  constructor() {}

  ngOnInit(): void {

  }

  get days() {
    const date = moment(this.selectedDate);

    return [...Array(date.daysInMonth()).keys()];
  }
}


