import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { ICalendars } from '../../models';
import { IFilter } from '@neural/shared/data';

// Set ICalendars Filter
export const SelectCurrentDate = createAction(
  '[Hub] Select Current Calendar',
  props<{ payload: any }>()
);

// Reset ICalendars Filter
export const ResetCalendarsFilter = createAction(
  '[Hub] Reset Calendars Filter',
);

// Set ICalendars Filter
export const SetCalendarsFilter = createAction(
  '[Hub] Set Calendars Filter',
  props<{ payload: ICalendars.IGetCalendar }>()
);

// Change ICalendars Filter
export const ChangeCalendarsFilter = createAction(
  '[Hub] Change Calendars Filter',
  props<{ payload: ICalendars.IGetCalendar }>()
);

// Create Calendar
export const CreateCalendar = createAction(
  '[Hub] Create Calendar',
  props<{ payload: ICalendars.IGenerateInternalCalendars }>()
);
export const CreateCalendarFail = createAction(
  '[Hub] Create Calendar Fail',
  props<{ payload: IFilter }>()
);
export const CreateCalendarSuccess = createAction(
  '[Hub] Create Calendar Success',
  props<{
    payload: string;
  }>()
);

// Load ICalendars
export const LoadCalendars = createAction('[Hub] Load ICalendars');
export const LoadCalendarsFail = createAction(
  '[Hub] Load Calendars Fail',
  props<{ payload: IFilter }>()
);
export const LoadCalendarsSuccess = createAction(
  '[Hub] Load Calendars Success',
  props<{
    payload: ICalendars.IDocument[];
  }>()
);

// Redirect To Calendars List
export const RedirectToCalendarsList = createAction(
  '[Hub] Redirect To Calendars List'
);

// Update Calendar Slot
export const UpdateCalendarSlot = createAction(
  '[Hub] Update Calendar Slot',
  props<{
    payload: ICalendars.IUpdateCalendarSlot;
  }>()
);
export const UpdateCalendarSlotFail = createAction(
  '[Hub] Update Calendar Slot Fail',
  props<{ payload: IFilter }>()
);
export const UpdateCalendarSlotSuccess = createAction(
  '[Hub] Update Calendar Slot Success',
  props<{
    payload: {
      document: Update<ICalendars.IDocument>;
      slot: ICalendars.IUpdateCalendarSlot;
    };
  }>()
);

// Update Calendar
export const UpdateCalendar = createAction(
  '[Hub] Update Calendar',
  props<{
    payload: ICalendars.IUpdateInternalCalendar;
  }>()
);
export const UpdateCalendarFail = createAction(
  '[Hub] Update Calendar Fail',
  props<{ payload: IFilter }>()
);
export const UpdateCalendarSuccess = createAction(
  '[Hub] Update Calendar Success',
  props<{
    payload: {
      document: Update<ICalendars.IDocument>;
      day: ICalendars.IUpdateInternalCalendar;
    };
  }>()
);

export const UpdateDay = createAction(
  '[Hub] Update Day',
  props<{
    payload: Update<ICalendars.IDocument>;
  }>()
)

// Branch Change
export const GoToCalendarList = createAction(
  '[Hub] Go To Calendar List'
);

const all = union({
  SelectCurrentDate,
  ResetCalendarsFilter,
  SetCalendarsFilter,
  ChangeCalendarsFilter,
  LoadCalendars,
  LoadCalendarsFail,
  LoadCalendarsSuccess,
  RedirectToCalendarsList,
  UpdateCalendarSlot,
  UpdateCalendarSlotFail,
  UpdateCalendarSlotSuccess,
  UpdateCalendar,
  UpdateCalendarFail,
  UpdateCalendarSuccess,
  CreateCalendar,
  CreateCalendarFail,
  CreateCalendarSuccess,
  GoToCalendarList,
});
export type CalendarsActionsUnion = typeof all;
