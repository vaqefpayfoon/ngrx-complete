import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CalendarsFacade } from '../+state';

//Models
import { ICalendars } from '../models';

//Moment
import * as _moment from 'moment';

import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root',
})
export class CalendarsResolver implements Resolve<boolean> {
  constructor(private calendarsFacade: CalendarsFacade) {}

  resolve(): Observable<boolean> {
    return this.calendarsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const current = moment();

          const payload: ICalendars.IGetCalendar = {
            year: current.year(),
            month: current.month() + 1,
          };

          this.calendarsFacade.setFilter(payload);
          this.calendarsFacade.changeDate(current);
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
