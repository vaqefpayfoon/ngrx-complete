import { Auth } from '@neural/auth';

export interface ILocation {
  address: string;
  unitNumber?: string;
  blockNumber?: string;
  latitude: number;
  longitude: number;
}

export enum Types {
  SHOW_ROOM = 'SHOW_ROOM',
  LOCATION = 'LOCATION',
}

export const Statuses = {
  REQUESTED: 'REQUESTED',
  SCHEDULED: 'SCHEDULED',
  VEHICLE_OUT: 'VEHICLE_OUT',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface ITestDriveCalendar {
  date: Date | string;
  slots: Date[] |  string[];
}

export enum Config {
  LIMIT = 10,
}

export interface IFilter {
  [key: string]: any;
}

export interface ISort {
  [key: string]: any;
}

export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface ISalesAdvisorData {
  docs: Auth.IAccount[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IConfig {
  page: number;
  limit: number;
  corporateUuid?: string;
}

export interface IDocument {
  uuid: string;
  payload: IPmlPayload;
  account: ITestDriveAccount;
  corporate: ITestDriveCorporate;
  branch?: ITestDriveBranch;
  status: string;
  source: string;
  location?: ILocation;
  selectedSlots: string[];
  type: string | Types;
  remark?: string;
  salesAdvisor?: IPmlPayloadSalesAdvisor;
  unit?: ITestDriveUnit;
}

export interface IAnswer {
  question: string;
  answer: string;
}

export interface IInstanceSummaryDocument {
  uuid: string;
  account: ITestDriveAccount;
  type: string;
  status: string;
}

export interface IInstanceFullDocument {
  uuid: string;
  account: ITestDriveAccount;
  corporate: ITestDriveCorporate;
  branch?: ITestDriveBranch;
  type: string;
  status: string;
}

export interface IApprovedTime {
  start: string;
  end: string;
}

export interface ITestDriveUnit {
  brand: string;
  modelUuid: string;
  model: string;
  variant: string;
  series?: string;
  display?: string;
  price: number;
}

export interface IPmlPayloadSalesAdvisor {
  name: string;
  email: string;
  phone: {
    code: string;
    phoneNumber: string;
  };
  uuid?: string;
}

export interface IPayloadDateTime {
  startTime: string;
  endTime?: string;
}

export interface IPmlPayload {
  answers?: IAnswer[];
  remark?: string;
  integration: {
    type: string;
    version: string;
  };
  scheduledDateAndTime?: IPayloadDateTime;
  actualDateAndTime: IPayloadDateTime;
  documents: {
    type: string;
    title: string;
    url: string;
  }[];
  id: string;
  company: string;
  salesAdvisor: IPmlPayloadSalesAdvisor;
  unit: {
    tradePlate?: string;
    numberPlate?: string;
    identificationNumber?: string;
    inVehicularUnit?: string;
    brand: string;
    model: string;
    variant: string;
    display: string;
    bodyStyle?: string;
    exteriorColor?: string;
    interiorColor?: string;
  };
}

export interface ICreateSelfLocation {
  answers?: IAnswer[];
  modelUuid: string;
  branchUuid: string;
  selectedSlots: string[];
  location: ILocation;
  agreements?: IAgreeCustomerAgreement;
  remark?: string;
}

export interface ICreateSelfShowRoom {
  answers?: IAnswer[];
  modelUuid: string;
  selectedSlots: string[];
  branchUuid: string;
  agreements?: IAgreeCustomerAgreement;
  remark?: string;
}

export interface IUpdatePayload {
  salesAdvisor: IPmlPayloadSalesAdvisor;
  actualDateAndTime: IPayloadDateTime;
}

export interface ITestDriveCorporate {
  uuid: string;
  name: string;
}

export interface IAgreeCustomerAgreement {
  agreedClauses: IAccountAgreedClause[];
}

export interface IAccountAgreedClause {
  type: string;
  isCompulsory: boolean;
  isAgreed: boolean;
}

export interface IUpdate {
  location?: ILocation;
  type?: Types;
  unit?: ITestDriveUnit;
  payload?: IUpdatePayload;
}

export interface ITestDriveAccount {
  email: string;
  uuid: string;
  identity: IIdentity;
  phone: IPhone;
  image?: string;
  uid?: string;
}

export interface IIdentity {
  salutation?: string;
  fullName: string;
}

export interface IPhone {
  code: string;
  number: string;
}

export interface ITestDriveBranch {
  uuid: string;
  name: string;
  location?: ILocation;
  mapCoveragePostalCodes?: string[];
}

export interface ILocation {
  address: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
}
