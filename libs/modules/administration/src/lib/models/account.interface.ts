import { Auth } from '@neural/auth';
import { IBranches } from '@neural/modules/customer/corporate';
import { IAccount } from 'libs/auth/src/lib/models/auth.interface';


export enum AccountType {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  OPERATION = 'OPERATION',
  ALL = 'ALL',
}

export const Salutation = {
  MR: 'MR',
  MS: 'MS',
  MRS: 'MRS',
  MDM: 'MDM',
  DR: 'DR',
  CAPTAIN: 'CAPTAIN',
  DATO: 'DATO',
  DATIN: 'DATIN',
  PROFESSOR: 'PROFESSOR',
  JUS: 'JUS',
};

export const DocumentType = {
  SINGAPORE_NRIC: 'SINGAPORE_NRIC',
  FOREIGN_IDENTIFICATION_NUMBER: 'FOREIGN_IDENTIFICATION_NUMBER',
  FOREIGN_PASSPORT: 'FOREIGN_PASSPORT',
  MALAYSIA_NRIC: 'MALAYSIA_NRIC',
  INDONESIA_NRIC: 'INDONESIA_NRIC',
};

export enum OperationRole {
  CSO = 'CSO',
  SA = 'SA',
  SERVICE_ADVISOR = 'SERVICE_ADVISOR',
  SALES_ADVISOR = 'SALES_ADVISOR',
}

export enum IDivisions {
  PRE_OWNED = 'PRE_OWNED',
  BRAND_NEW = 'BRAND_NEW',
}

export interface IIdentity {
  salutation?: string;
  fullName: string;
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
  filter?: IFilter;
  sort?: ISort;
  page: number;
  limit: number;
}

export interface IFilter {
  [key: string]: string;
}

export interface ISort {
  [sort: string]: number;
}
export interface ISearch {
  email: string;
  name: string;
}
export interface IDocument extends ICreate {
  uuid: string;
  group: Group;
  email: string;
  identity: Auth.IIdentity;
  image?: string;
  products: string[];
  active: boolean;
  qrCode?: string;
  integrations?: Integrations;
}

export interface Integrations {
  cdk?: Cdk;
  fortellis?:Fortellis
}

export interface Fortellis {
  customerId? : string;
}

export interface Cdk {
  serviceAdvisorId? : string;
}
export interface IPermission {
  adminGroupUuid: string;
  operationRole?: string;
  brands?: string[];
  divisions?: IDivisions[];
}

export interface ICso {
  since?: number;
  rate?: number;
  averageServiceTime?: string;
}
export interface ICreate {
  device?: Device;
  identity: IIdentity;
  permissions: IPermission;
  email: string;
  phone: IPhone;
  document?: IDocumentType;
  password: string;
  products: string[];
  corporate: ICorporates;
  dateOfBirth?: string;
  drivingLicenseExpiry?: string;
  cso?: ICso;
  integrations?: Integrations;
}

export interface IUpdate {
  uuid?: string;
  identity: IIdentity;
  document?: IDocumentType;
  corporate: ICorporates;
  products: string[];
  phone?: IPhone;
  email?: string;
  permissions: IPermission;
  dateOfBirth?: string;
  drivingLicenseExpiry?: string;
  cso?: ICso;
  integrations?: Integrations;
}

export interface IDocumentType {
  type: string;
  id: string;
}

export interface IUpdatePass extends IDocument {
  password: string;
}

export interface IBranch {
  uuid: string;
  name: string;
  active: boolean;
  corporateUuid: string;
  landingPhone: string;
  cellPhone: string;
  address: string;
  image: string;
  paymentTransactions: PaymentTransactions[];
  mapCoveragePostalCodes: IBranches.IMapCoveragePostalCode;
  calendarSchema: string;
  salesforceEndpoints: SalesforceEndpoints[];
}

export interface PaymentTransactions {
  gateways: string[];
  currency: string;
  serviceId: string;
  password: string;
  merchantCallbaclUrl?: string;
  merchantReturnUrl?: string;
}

export interface SalesforceEndpoints {
  get: string;
  block: string;
  release: string;
  reschedule: string;
}

export interface Name {
  first: string;
  last: string;
}

export interface IPhone {
  code: string;
  number: string;
}

export interface Group {
  name: string;
  uuid: string;
}

export interface Device {
  os: string;
  osVersion: string;
  device: string;
  browser: string;
  browserVersion: number;
  appIdentifier: string;
  appVersion: number;
}

export interface ICorporates {
  uuid: string;
  branches: string[];
}

export interface ISynchronization {
  [name: string]: File | string;
}

export interface IReservationAccount {
  email?: string;
  uuid?: string;
  identity?: IIdentity;
  phone: IPhone;
  image?: string;
  uid?: string;
}
