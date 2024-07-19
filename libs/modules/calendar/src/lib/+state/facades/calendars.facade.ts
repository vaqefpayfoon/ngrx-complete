import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICalendarState } from '../reducers';

// Selector
import { CalendarsQuery } from '../selectors';

// Action
import { CalendarsActions } from '../actions';

// Model
import { ICalendars } from '../../models';

@Injectable()
export class CalendarsFacade {
  loading$ = this.store.select(CalendarsQuery.getCalendarsLoading);

  loaded$ = this.store.select(CalendarsQuery.getCalendarsLoaded);

  error$ = this.store.select(CalendarsQuery.getCalendarsError);

  calendars$ = this.store.select(CalendarsQuery.getAllCalendars);

  calendar$ = this.store.select(CalendarsQuery.getSelectedCalendar);

  calendarsFilter$ = this.store.select(CalendarsQuery.getCalendarsFilter);

  selectedDate$ = this.store.select(CalendarsQuery.getSelectedDate);

  total$ = this.store.select(CalendarsQuery.getCalendarsTotal);

  constructor(private store: Store<ICalendarState>) {}

  setFilter(payload: ICalendars.IGetCalendar) {
    this.store.dispatch(CalendarsActions.SetCalendarsFilter({ payload }));
  }

  changeFilter(payload: ICalendars.IGetCalendar) {
    this.store.dispatch(CalendarsActions.ChangeCalendarsFilter({ payload }));
  }

  changeDate(payload: any) {
    this.store.dispatch(CalendarsActions.SelectCurrentDate({ payload }));
  }

  updateTimeSlot(payload: ICalendars.IUpdateCalendarSlot) {
    this.store.dispatch(CalendarsActions.UpdateCalendarSlot({ payload }));
  }

  updateTime(payload: ICalendars.IUpdateInternalCalendar) {
    this.store.dispatch(CalendarsActions.UpdateCalendar({ payload }));
  }

  create(payload: ICalendars.IGenerateInternalCalendars) {
    this.store.dispatch(CalendarsActions.CreateCalendar({ payload }));
  }

  branchChange() {
    this.store.dispatch(CalendarsActions.GoToCalendarList());
  }
}
