import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { ICalendars } from '../../models';

// facade
import { CalendarsFacade  } from '../../+state/facades';
// import {  ManualReservationFacade } from '@neural/modules/jobs';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'neural-calendars',
  templateUrl: './calendars.component.html',
  styleUrls: ['./calendars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarsComponent implements OnInit {
  timeZone$: Observable<string>;

  bc: IBC[];

  calendars$: Observable<ICalendars.IDocument[]>;
  total$: Observable<number>;
  calendarsFilter$: Observable<ICalendars.IGetCalendar>;

  selectedDate$: Observable<_moment.Moment>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private calendarsFacade: CalendarsFacade,
    // private manualReservationFacade: ManualReservationFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'calendars',
        path: null,
      },
    ];

    this.calendars$ = this.calendarsFacade.calendars$;
    this.total$ = this.calendarsFacade.total$;
    this.calendarsFilter$ = this.calendarsFacade.calendarsFilter$;

    this.loading$ = this.calendarsFacade.loading$;
    this.error$ = this.calendarsFacade.error$;

    this.selectedDate$ = this.calendarsFacade.selectedDate$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Calendar.LIST_NERV_CALENDAR,
      permissionTags.Calendar.GENERATE_CALENDARS,
      permissionTags.Calendar.UPDATE_CALENDAR,
      permissionTags.Calendar.UPDATE_CALENDAR_SLOT,
      permissionTags.ManualReservation.LIST_MANUAL_RESERVATIONS,
    ]);

    this.timeZone$ = this.authFacade.timeZone$;
  }

  onRefresh(event: boolean) {
    if (event) {
      const current = moment();

      const payload: ICalendars.IGetCalendar = {
        year: current.year(),
        month: current.month() + 1,
      };

      this.calendarsFacade.setFilter(payload);
      this.calendarsFacade.changeDate(current);
    }
  }

  onChangeFilter(payload: ICalendars.IGetCalendar) {
    this.calendarsFacade.changeFilter(payload);
  }

  onChangeTime(payload: string) {
    this.calendarsFacade.changeDate(payload);
  }

  onChangeDate(payload: ICalendars.IUpdateInternalCalendar) {
    this.calendarsFacade.updateTime(payload);
  }

  onChangeSlot(payload: ICalendars.IUpdateCalendarSlot) {
    this.calendarsFacade.updateTimeSlot(payload);
  }

  onSelectSlot(payload: {
    selectedDay: ICalendars.IDocument;
    selectedSlot: ICalendars.ISlot;
  }) {
    // this.manualReservationFacade.selectSlot(payload);
    ///we need to check the need for this
  }
}
