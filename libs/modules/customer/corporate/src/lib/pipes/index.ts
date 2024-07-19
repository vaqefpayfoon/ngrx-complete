import { EventTitlesPipe } from './event-titles.pipe';
import { SmsEventTitlesPipe } from './sms-event-titles.pipe';
import { CheckedEventsPipe } from './checked-events.pipe';

export const PIPES = [EventTitlesPipe, CheckedEventsPipe,SmsEventTitlesPipe];

export * from './event-titles.pipe';
export * from './sms-event-titles.pipe';
export * from './checked-events.pipe';
