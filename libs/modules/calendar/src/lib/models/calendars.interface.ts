export enum CalendarSource {
  SALESFORCE = 'SALESFORCE',
  INTERNAL = 'INTERNAL',
}

export enum CalendarType {
  MOBILITY = 'Mobility',
  SERVICE = 'Service',
  REPAIR = 'Repair',
}

export enum DateType {
  RANGE = 'RANGE',
  DAYS = 'DAYS',
}

export enum TestDriveTypes {
  SHOW_ROOM = 'showRoom',
  LOCATION = 'location',
}

export interface IMobilityDay extends ICorporateCalendarDay {
  session: IMobileServiceSession;
  break: ICorporateCalendarDay;
}

export interface IMobileServiceSession {
  travelTime: number;
  serviceTime: number;
}

export interface ICorporateCalendarDay {
  start: string;
  end: string;
}

export interface IListInternalCalendars {
  type: CalendarType;
  branchUuid: string;
}

export interface IGenerateInternalCalendars extends IListInternalCalendars {
  start?: string;
  end?: string;
  days?: number;
}

export interface IMobilityConfig {
  day: IMobilityDay;
}

export interface IRepairConfig {
  csoCount: number;

  day: IRepairDay;
}

export interface IServiceConfig {
  csoCount: number;
  day: IServiceDay;
}

export interface IRepairDay extends ICorporateCalendarDay {
  session: IRepairSession;
  break: ICorporateCalendarDay;
  bay: ICalendarBay;
}

export interface IServiceDay extends ICorporateCalendarDay {
  session: IServiceSession;
  break: ICorporateCalendarDay;
  bay: ICalendarBay;
}

export interface IServiceSession {
  serviceTime: number;
  meeting: IServiceMeeting;
}

export interface IServiceMeeting {
  duration: number;
}

export interface ICalendarBay {
  count: number;
}

export interface IRepairSession {
  serviceTime: number;
  meeting: IRepairSessionMeeting;
}

export interface IRepairSessionMeeting extends ICorporateCalendarDay {
  duration: number;
}

export interface IUpdateInternalCalendar extends IUuid {
  isBlocked?: boolean;
  remark?: string;
  day?: string;
}

export interface IUpdateInternalCalendarDay extends IUpdateInternalCalendar {
  mobility?: IMobilityConfig;
  repair?: IRepairConfig;
  service?: IServiceConfig;
}

export interface IUuid {
  uuid: string;
}

export interface IUuidSlot extends IUuid {
  slot: string;
}

export interface IType {
  type: CalendarSource;
}

export interface ITestDriveCalendar {
  modelUuid: string;
  year: number;
  month: number;
  branchUuid: string;
  type: TestDriveTypes;
}

export interface IGetCSAEarliestTime {
  branchUuid: string;
  serviceType: CalendarType;
  csaId: string;
}

export interface IGetBranchEarliestTime {
  branchUuid: string;
  accountVehicleUuid?: string;
  csaId?: string;
}

export interface IGetCalendar {
  branchUuid?: string;
  year?: number;
  month?: number;
  accountVehicleUuid?: string;
  selectedTypes?: string[];
  csaId?: string;
}

export interface IDocument {
  uuid: string;
  available: boolean;
  day: string;
  slots: ISlot[];
  active?: boolean;
  isBlocked?: boolean;
  remark?: string;
  type?: CalendarType;
  branchUuid?: string;
  corporateUuid?: string;
}

export type CalendarSlot = Pick<CalendarDay, 'date' | 'available'> & {
  isBlocked?: boolean;
  remark?: string;
};

export type CalendarDay = Required<
  Record<'date' | 'weekday' | 'start' | 'end', string>
> &
  Record<'available', number>;

export interface ISlot {
  iso: Date;
  isBlocked: boolean;
  available: boolean;
  time: string;
  count: number;
  remark?: string;
}

export interface IUpdateCalendarSlot extends IUpdateInternalCalendar, IUuid {
  iso: Date;
  time: string;
}
