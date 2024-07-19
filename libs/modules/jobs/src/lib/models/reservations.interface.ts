import { Auth } from '@neural/auth';

import { IBranches } from '@neural/modules/customer/corporate';

import * as IManualReservations from './manual-reservations.interface';

import { IPromotions } from '@neural/modules/rewards';

export type IPaymentCallback = Partial<
  Record<
    | 'BankRefNo'
    | 'RespTime'
    | 'TnxMessage'
    | 'HashValue'
    | 'HashValue2'
    | 'TxnID'
    | 'IssuingBank'
    | 'TnxStatus'
    | 'AuthCode'
    | 'TransactionType'
    | 'PmtMethod'
    | 'ServiceID'
    | 'PaymentID'
    | 'OrderNumber'
    | 'Amount'
    | 'CurrencyCode',
    string
  >
>;

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export enum Status {
  BOOKING_ON_HOLD = 'BOOKING_ON_HOLD',
  JOB_PENDING = 'JOB_PENDING',
  FLEET_EN_ROUTE = 'FLEET_EN_ROUTE',
  JOB_IN_PROGRESS = 'JOB_IN_PROGRESS',
  JOB_COMPLETED = 'JOB_COMPLETED',
  NOT_OPERATIONAL = 'NOT_OPERATIONAL',
  JOB_CANCELED = 'JOB_CANCELED',
  NO_SHOW = 'NO_SHOW',
}

export enum InProgressServiceStatus {
  SERVICE_PENDING = 'SERVICE_PENDING',
  SERVICE_IN_PROGRESS = 'SERVICE_IN_PROGRESS',
  SERVICE_COMPLETED = 'SERVICE_COMPLETED',
}

export enum InvoiceStatus {
  SIGNATURE_REQUIRED = 'SIGNATURE_REQUIRED',
  SIGNATURE_IN_PROGRESS = 'SIGNATURE_IN_PROGRESS',
  SIGNATURE_COMPLETED = 'SIGNATURE_COMPLETED',
}

export const StatusMapping = {
  MobileService: {
    FLEET_EN_ROUTE: [Status.JOB_PENDING],
    JOB_IN_PROGRESS: [Status.FLEET_EN_ROUTE],
    SERVICE_IN_PROGRESS: [Status.JOB_IN_PROGRESS],
    SERVICE_COMPLETED: [Status.JOB_IN_PROGRESS],
    JOB_COMPLETED: [Status.JOB_IN_PROGRESS],
  },
  ServiceCenter: {
    JOB_IN_PROGRESS: [Status.JOB_PENDING],
    JOB_COMPLETED: [Status.JOB_IN_PROGRESS],
  },
};

export const InvoiceStatusMapping = {
  FLEET_EN_ROUTE: [],
  JOB_IN_PROGRESS: [],
  SERVICE_IN_PROGRESS: [],
  SERVICE_COMPLETED: [],
  JOB_COMPLETED: [InvoiceStatus.SIGNATURE_COMPLETED],
};

export const RepairOrderStatusMapping = {
  FLEET_EN_ROUTE: [],
  JOB_IN_PROGRESS: [],
  SERVICE_IN_PROGRESS: [],
  SERVICE_COMPLETED: [],
  JOB_COMPLETED: [InvoiceStatus.SIGNATURE_COMPLETED],
};

export const PaymentStatus = {
  NOT_REQUIRED: 'NOT_REQUIRED',
  REQUIRED: 'REQUIRED',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  REFUNDED: 'REFUNDED',
  UNKNOWN: 'UNKNOWN',
};

export const UpcomingTypes = {
  MOBILE_SERVICE: 'MOBILE_SERVICE',
  SERVICE_CENTER: 'SERVICE_CENTER',
  TEST_DRIVE: 'TEST_DRIVE',
};

export const UpcomingTitles = {
  MOBILE_SERVICE: 'Mobile Service Appointment',
  SERVICE_CENTER: 'Service Center Appointment',
  TEST_DRIVE: 'Test Drive Appointment',
};

export enum RosterType {
  RESERVATION = 'RESERVATION',
  MANUAL_RESERVATION = 'MANUAL_RESERVATION',
}

export enum ServiceAdvisorFilter {
  ALL = 'all',
  UNASSIGNED = 'unassigned',
}

export enum Logistic {
  WAIT = 'WAIT',
  DROP_IN = 'DROP_IN',
}
export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IMixedData {
  reservations?: any;
  totals?: ITotals;
}

export interface IReservationSlots {
  day: string;
  available: boolean;
  slots: ISlot[];
}

export interface ISlot {
  count: number;
  iso: Date;
  available: boolean;
  time: string;
}

export interface ITotals {
  all: number;
  unassigned: number;
  serviceAdvisors: [];
}
export interface IData2 {
  docs: MyReservations[];
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
  mobileService?: number;
  serviceType?: string;
  statusFilter?: string[];
  dateFilter?: string;
  page: number;
  limit: number;
}

export interface IFilter {
  [filter: string]: number | string | Date | null;
}

export interface IDocument {
  type: RosterType.RESERVATION;
  uuid: string;
  status: string;
  referenceNumber: string;
  account: IAccount;
  branch: IBranch;
  accountVehicle: IAccountVehicle;
  payment: IPayment;
  chat?: IChat;
  operation?: IOperation;
  services?: IJobService[];
  products?: IProduct[];
  location: ILocation;
  calendar: ICalendar;
  summary: ISummary;
  invoice?: IInvoice;
  repairOrder?: IRepairOrder;
  fleet: IFleet;
  mobileService: boolean;
  promo?: IPromotions.InstanceDocument;
  progress?: IProgress;
  corporate: ICorporate;
  reservation: boolean;
  logistic?: Logistic;
  appointment?: IAppointment;
}
export interface IProgress {
  date: any;
  elements: IElement[];
}
export interface IElement {
  date: any;
  status: string;
  type: string;
}

export interface IMixedDocuments extends IManualReservations.IDocument {
  type: RosterType.MANUAL_RESERVATION;
}

export type MyReservations = IDocument | IMixedDocuments;

export interface IReschedule {
  reservation: IDocument;
  slot: string;
}

export interface IProduct {
  branchUuid: string;
  partNumber: string;
  pricing: IPricing;
  productReference: IProductReference;
  quantity: string;
  service: IService;
  serviceUuid: string;
  status: string;
  uuid: string;
}

export interface IJobService {
  category: string;
  icon: string;
  pricing: IPricing;
  quantity: number;
  status: string;
  subtitle: string;
  title: string;
  type: string;
  uuid: string;
}

export interface IPricing {
  calculatedTax?: number;
  labour: number;
  unitBuyingPrice?: number;
  recommendedRetailPrice: number;
  total: number;
  discountedLabour?: number;
  discountedTotal?: number;
}

export interface IProductReference {
  image: string;
  serviceUuid: string;
  unit: IPUnit;
  uuid: string;
}

export interface IPUnit {
  brand: string;
  display: string;
  model: string;
  specification: ISpec[];
}

export interface ISpec {
  key: string;
  value: string;
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

export interface IPhone {
  code: string;
  number: string;
}

export interface IBranch {
  uuid: string;
  name: string;
  currency: string;
  workshop: IWorkshop;
  location: ILocation;
  mapCoveragePostalCodes: IBranches.IMapCoveragePostalCode;
}

export interface IWorkshop {
  name: string;
  id: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
  address?: string;
  unitNumber?: string;
  blockNumber?: string;
  zipCode?: string;
}

export interface IAccountVehicle {
  uuid: string;
  numberPlate: string;
  identificationNumber: string;
  fuelType?: string;
  manufacturerYear?: number;
  registrationYear?: number;
  registrationDate?: string;
  image?: string;
  vehicleReference: IVehicleReference;
}

export interface IUnit {
  brand: string;
  display: string;
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
  image?: string;
  uuid: string;
  type: string;
  bodyStyle: string;
}

export interface IOperation {
  email: string;
  uuid: string;
  identity: Auth.IIdentity;
  image: string;
  active: boolean;
  phone: IPhone;
  groupUuid: string;
  uid: string;
}

export interface ICorporate {
  uuid: string;
  type: string;
  name: string;
  registrationNumber: string;
  appIdentifiers: string[];
  vehicleCoverageWhiteList: boolean;
}

export interface IService {
  uuid: string;
  category: string;
  type: string;
  title: string;
  subtitle: string;
  quantity: number;
  pricing: IPricingService;
}

export interface IPricingService {
  unitBuyingPrice: number;
  recommendedRetailPrice: number;
  labour: number;
  tax: number;
  total: number;
}

export interface ILocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export enum CalendarSource {
  SALESFORCE = 'SALESFORCE',
  INTERNAL = 'INTERNAL',
}

export enum CalendarType {
  MOBILITY = 'Mobility',
  SERVICE = 'Service',
  REPAIR = 'Repair',
}

export interface ICalendar {
  type: CalendarSource;
  workshopType?: string;
  selectedTypes?: CalendarType[];
  csaId?: string;
  slot: string;
  logistic: string;
}

export class ISummary {
  subtotal: number;
  labour: number;
  total: number;
  tax: number;
  payableAmount: number;
}

export class IPayableAmount {
  timestamp: number;
  payableAmount: number;
}

export interface IInvoicePayment {
  method: string;
  gateway?: string;
  status: string;
  payload?: object;
  payableAmount: number;
  upSellAmount?: number;
  payableAmounts?: IPayableAmount[];
}

export interface IInvoice {
  docUrl: string;
  status: string;
  number: string;
  payment?: IInvoicePayment;
}

export interface IRepairOrder {
  docUrl: string;
  status: string;
  number: string;
}

export interface IChat {
  author: string;
  id: string;
  message: string;
  timestamp: number;
}

export interface ITracking {
  accuracy: number;
  altitude: number;
  arrivalTime?: number;
  bearing: number;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: number;
}

export interface IInProgressJob {
  job: IDocument;
  chat?: IChat[];
  tracking?: ITracking;
}
export interface IInProgressJobList {
  reservations: string[];
  manualReservations: string[];
}

export interface IPayment {
  currency: string;
  method: string;
  gateway?: string;
  status: string;
  payload?: object;
  payableAmount: number;
}

export interface IFleet {
  name: string;
  numberPlate: string;
  uuid: string;
}

export interface ICreate {
  uuid: string;
  number: string;
  file: any;
  reservation: boolean;
  type: string;
  status: string;
}

export interface IUpdate {
  uuid: string;
  number?: string;
  payableAmount?: number;
  upSellAmount?: number;
  file?: any;
  reservation: boolean;
  type: string;
  status: string;
}

export interface IAssign {
  operationUuid: string;
  fleetUuid?: string;
}

export interface IAssignDocument {
  uuid?: string;
  operation: IOperationTeam;
  fleet?: IFleetTeam;
}

export interface IOperationTeam {
  fullname: string;
  uuid: string;
}

export interface IFleetTeam {
  name: string;
  uuid: string;
}

export interface IError {
  status: number;
  message: string;
}

export interface IDailyReport {
  analytics: IAnalytics;
}

export interface IAnalytics {
  operations: IOperations;
  report: IReport;
}

export interface IOperations {
  key: string;
  url: string;
}

export interface IServicesReport {
  services: IJob;
  report: IReport;
}

export interface IJobsReport {
  jobs: IJob;
  report: IReport;
}

export interface IAmendedsReport {
  amendedInvoices: IJob;
  report: IReport;
}

export interface IJob {
  key: string;
  url: string;
}

export interface IReport {
  aggregateBy?: string;
  branchUuid?: string;
  corporateUuid?: string;
  resultType: string;
  scope?: string;
  selectedDate: string;
}
export interface IAppointment {
  id: string;
  customerServiceAgentId: string;
  customerServiceAgentName: string;
}
