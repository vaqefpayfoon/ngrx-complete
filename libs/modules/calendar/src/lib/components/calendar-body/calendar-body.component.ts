import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

// Models
import { ICalendars } from '../../models';

// Block calendar dialog
import { CalendarSlotBlockConfirmationDialogComponent } from '../calendar-slot-block-confirmation-dialog/calendar-slot-block-confirmation-dialog.component';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-calendar-body',
  templateUrl: './calendar-body.component.html',
  styleUrls: ['./calendar-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarBodyComponent {
  @Input() permissions: any;

  @Input() getCalendarFilter: ICalendars.IGetCalendar;

  @Input() timeZone: string;

  @Input() selectedDate: _moment.Moment;

  @Input() calendars: ICalendars.IDocument[];

  @Output() slotBlocked = new EventEmitter<ICalendars.IUpdateCalendarSlot>();

  @Output() selectSlot = new EventEmitter<{
    selectedDay: ICalendars.IDocument;
    selectedSlot: ICalendars.ISlot;
  }>();

  selectedSlot: string;

  constructor(private dialog: MatDialog) {}

  openDialog(slot: ICalendars.ISlot, uuid: string) {
    const dialogRef = this.dialog.open(
      CalendarSlotBlockConfirmationDialogComponent,
      {
        data: slot,
        disableClose: true,
      }
    );

    dialogRef.componentInstance.blockedChanges.subscribe(
      (res: ICalendars.IUpdateCalendarSlot) => {
        this.slotBlocked.emit({
          ...res,
          uuid,
          iso: slot.iso,
          time: slot.time,
        });
      }
    );
  }

  reserve(payload: {
    selectedDay: ICalendars.IDocument;
    selectedSlot: ICalendars.ISlot;
  }) {
    this.selectSlot.emit(payload);
  }

  get times() {
    const allTimes = [];

    const x = {
      endTime: this.selectedDate.endOf('day').hours(21).minutes(0),
      slotInterval: 60,
    };

    const startTime = moment(this.selectedDate)
      .startOf('day')
      .hours(6)
      .minutes(0);

    while (startTime <= x.endTime) {
      allTimes.push(startTime.toISOString());
      startTime.add(x.slotInterval, 'minutes');
    }

    return allTimes;
  }

  get day(): ICalendars.IDocument {
    return this.calendars.find(
      (calendar) => moment(calendar.day).date() === this.selectedDate.date()
    );
  }

  get calendarType() {
    return ICalendars.CalendarType;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Calendar.UPDATE_CALENDAR_SLOT]
    ) {
      return true;
    }
    return false;
  }

  get listPermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ManualReservation.LIST_MANUAL_RESERVATIONS
      ]
    ) {
      return true;
    }
    return false;
  }
}
