export enum CalendarSource {
  SALESFORCE = 'SALESFORCE',
  INTERNAL = 'INTERNAL',
}

export enum CalendarType {
  MOBILITY = 'Mobility',
  SERVICE = 'Service',
  REPAIR = 'Repair',
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

export interface ISlot {
  iso: Date;
  isBlocked: boolean;
  available: boolean;
  time: string;
  count: number;
}
