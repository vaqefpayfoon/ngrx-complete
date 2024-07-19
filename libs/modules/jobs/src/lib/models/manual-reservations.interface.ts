import { ICalendars } from '@neural/modules/calendar';
import { Auth } from '@neural/auth';
import { IServiceLine } from '.';

export enum DmsSearchKey {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  phone = 'phone',
}

export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum Config {
  LIMIT = 10,
}

export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IConfig {
  page: number;
  limit: number;
}

export interface IOperationData {
  docs: Auth.IAccount[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IDocument extends ICreate {
  uuid: string;
  active: boolean;
  referenceNumber: string;
  branch: IManualReservationBranch;
  operation: Auth.IAccount;
  location: ILocation;
  mobileService: boolean;
  status?: string;
  logistic: Logistic;
  appointment?: IAppointment;
}

export interface IAppointment {
  id: string;
  customerServiceAgentId: string;
  customerServiceAgentName: string;
}

export interface IFilter {
  [key: string]: any;
}

export interface ISort {
  [sort: string]: number;
}

export interface IManualReservationBranch {
  uuid: string;
  name: string;
}

export interface IManualReservationVehicle {
  numberPlate: string;
  model?: IModel;
  mileage?: number;
  brand: string;
  year: string;
  identificationNumber: string;
}

export interface IModel {
  id: string;
  name: string;
}
export interface IManualReservationAccount {
  fullName: string;
  phone: string;
  email?: string;
}
export enum Logistic {
  WAIT = 'WAIT',
  DROP_IN = 'DROP_IN',
  PICK_UP_AND_DELIVERY = 'PICK_UP_AND_DELIVERY',
}
export interface IManualReservationCalendar {
  type: ICalendars.CalendarSource.INTERNAL;
  serviceTypes: ICalendars.CalendarType[];
  slot: string;
  logistic?: Logistic;
}

export interface IAvailableSlot {
  available: Boolean;
  count: number;
  isBlocked: Boolean;
  iso: string;
  navigationId?: number;
  time: string;
  type: ICalendars.CalendarType[];
}
export interface ILocation {
  address: string;
}

export interface ICreate {
  branchUuid: string;
  operationUuid: string;
  account: IManualReservationAccount;
  accountVehicle: IManualReservationVehicle;
  calendar: IManualReservationCalendar;
  integration: ICdk;
  remark?: string;
  serviceLines?: IServiceLine.IDocument[];
  customerTag: string;
}

export interface ICdk {
  vehicleId?: string;
  customerId?: string;
}
export interface IUpdate {
  operationUuid?: string;
  account?: IManualReservationAccount;
  accountVehicle?: IManualReservationVehicle;
  calendar?: IManualReservationCalendar;
  integration: ICdk;
  remark?: string;
  logistic?: Logistic;
  serviceLines?: IServiceLine.IDocument[];
  uuid?: string;
  customerTag: string;
}

export interface IDMSFilter {
  key: DmsSearchKey;
  name: string;
  firstName?: string;
}

export interface IDMSCustomer {
  id: string;
  identity: IIdentity;
  phone: IPhone;
  email?: string;
}

export interface IIdentity {
  fullName: string;
}

export interface IPhone {
  number: string;
}

export interface ICDKVehicle<Entity> {
  docs?: Entity[]
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IVehicleMakes {
  makeId: string;
  name: string;
}

export interface IVehicleModels{
  modelId: string;
  name?: string;
}

export interface IVehicleYearMakes{
  variantId: string;
  name: string;
}


export const Filter = {
  like: [
    'account.fullName',
    'account.phone',
    'account.email',
    'referenceNumber',
    'branch.uuid',
    'accountVehicle.numberPlate',
    'calendar.slot',
    'calendar.serviceTypes',
  ],
};
export const Sort = Filter.like;
