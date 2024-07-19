export enum Types {
  USER_REGISTRATION = 'USER_REGISTRATION',
  SERVICE_CENTER_BOOKING = 'SERVICE_CENTER_BOOKING',
  MOBILE_SERVICE_BOOKING = 'MOBILE_SERVICE_BOOKING',
  TEST_DRIVE_BOOKING = 'TEST_DRIVE_BOOKING',
  SALE_BOOKING = 'SALE_BOOKING',
}

export const ClauseTypes = {
  USER_REGISTRATION: {
    MARKETING: 'MARKETING',
    DATA_CONSENT: 'DATA_CONSENT',
  },
  SERVICE_CENTER_BOOKING: { SERVICE_REQUEST: 'SERVICE_REQUEST' },
  MOBILE_SERVICE_BOOKING: { SERVICE_REQUEST: 'SERVICE_REQUEST' },
  TEST_DRIVE_BOOKING: { SERVICE_REQUEST: 'SERVICE_REQUEST' },
  SALE_BOOKING: { VEHICLE_PURCHASE: 'VEHICLE_PURCHASE' },
};

export interface IConfig {
  corporateUuid: string;
}

export interface IClause {
  title: string;
  type: string;
  isCompulsory: boolean;
  isChecked: boolean;
}

export interface IDocument extends ICreate {
  uuid: string;
  pdfUrl: string;
}

export interface IClausElement {
  title: string;
  type: string;
  isCompulsory: boolean;
  isChecked: boolean;
}
export interface IClause {
  title: string;
  elements: IClausElement[];
  pdfUrl?: string;
}
export interface ICreate {
  corporateUuid: string;
  type: Types | string;
  clauses: IClause[];
}

export interface IUpdate {
  corporateUuid: string;
  clauses: IClause[];
}

export interface IUploadFile {
  corporateUuid: string;
  file: File;
  type: Types;
}
