import { Auth } from '@neural/auth';

export enum Reason {
  WILL_BOOK_VIA_APP = 'WILL_BOOK_VIA_APP',
  BOOKED_VIA_APP = 'BOOKED_VIA_APP',
  BOOKED_OFFLINE = 'BOOKED_OFFLINE',
  UNREACHABLE = 'UNREACHABLE',
  CUSTOMER_NOT_AVAILABLE = 'CUSTOMER_NOT_AVAILABLE',
  NOT_CURRENT_VEHICLE_OWNER = 'NOT_CURRENT_VEHICLE_OWNER',
  SERVICE_AT_DIFFERENT_DEALERSHIP = 'SERVICE_AT_DIFFERENT_DEALERSHIP',
  OTHERS = 'OTHERS'
}

export enum Status {
  NOT_REACHED = 'NOT_REACHED',
  FIRST_NOTIFICATION = 'FIRST_NOTIFICATION',
  SECOND_NOTIFICATION = 'SECOND_NOTIFICATION',
  FOLLOW_UP = 'FOLLOW_UP',
  CLOSED = 'CLOSED'
}

export const ProgressBar = [
  'FIRST_NOTIFICATION',
  'SECOND_NOTIFICATION',
  'FOLLOW_UP'
];

export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum Config {
  LIMIT = 10
}

export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IConfig {
  statusFilter?: string[];
  dateFilter?: string;
  page: number;
  limit: number;
}

export interface IDocumentVin {
  account: IAccount;
  accountVehicle: IAccountVehicle;
}

export interface IClose {
  reason: string;
  remark: string;
}

export interface IDocument {
  uuid: string;
  status: string;
  account: IAccount;
  personInChargeUuid: string;
  accountVehicle: IAccountVehicle;
}

export interface IAccount {
  email: string;
  uuid: string;
  identity: Auth.IIdentity;
  phone: IPhone;
  image?: string;
  groupUuid: string;
  uid: string;
}

export interface IName {
  first: string;
  last: string;
}

export interface IPhone {
  code: string;
  number: string;
}

export interface IAccountVehicleList {
  numberPlate: string;
  vehicleOwnerReference: string;
  registrationDate?: string;
  identificationNumber?: string;
}

export interface IAccountVehicle {
  uuid: string;
  numberPlate: string;
  identificationNumber: string;
  fuelType?: string;
  manufacturerYear?: number;
  registrationYear?: number;
  registrationDate?: string;
  vehicleReference: IVehicleReference;
}

export interface IUnit {
  brand: string;
  model: IModel;
  variant: IVariant;
}

export interface IModel {
  actual: string;
  display: string;
}

export interface IVariant {
  actual: string;
  display: string;
}

export interface IVehicleReference {
  unit?: IUnit;
  uuid: string;
  type: string;
  bodyStyle: string;
}

export interface ICreate {
  accountVehicleUuid: string;
}

export interface IUpdate {
  uuid: string;
  number: string;
  payableAmount: number;
}

export interface IVin {
  vin: string;
}

export interface IWarrantiesReport {
  warranties: IJob;
  report: IReport;
}

export interface IJob {
  key: string;
  url: string;
}

export interface IReport {
  aggregateBy: string;
  corporateUuid: string;
  resultType: string;
  scope: string;
}
