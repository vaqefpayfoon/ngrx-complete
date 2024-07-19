import { IConfiguration } from './configuration-branches.interface';

export enum GatewaysName {
  EGHL = 'EGHL',
  MIDTRANS = 'MIDTRANS',
  ADYEN = 'ADYEN',
  STRIPE = 'STRIPE',
}

export enum PaymentStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  REQUIRED = 'REQUIRED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
  UNKNOWN = 'UNKNOWN',
}

export enum MethodNames {
  CASH = 'CASH',
  POS = 'POS',
  ONLINE_BANKING = 'ONLINE_BANKING',
}

export enum PaymentTypes {
  SALES = 'sales',
  AFTER_SALES = 'afterSales',
}

export enum Currencies {
  MYR = 'MYR',
  USD = 'USD',
  SGD = 'SGD',
  IDR = 'IDR',
}

export interface ICreate {
  name: string;
  email?: string;
  order?: number;
  workshops?: IWorkshop[];
  location: ILocation;
  corporateUuid: string;
  landingPhone: string;
  image: any;
  payments?: IPayment;
  mapCoveragePostalCodes?: IMapCoveragePostalCode | any;
  configuration: IConfiguration;
  schedules: ISchedules[];
  schedulesOffDays: IOffDaysItem[];
}
export interface IDocument extends ICreate {
  uuid: string;
  active: boolean;
}

export interface ISchedules {
  uuid?: string;
  name: string;
  type: SchedulesType;
  maxAppointmentsPerWeek: number;
  slotDuration: number;
  maxAppointments: number;
  teams: ITeams[];
}

export interface ISchedulesPayload {
  branchUuid?: string;
  corporateUuid?: string;
  data?: ISchedules;
}

export interface ISchedulesResponse {
  branchUuid?: string;
  corporateUuid?: string;
  schedulerUuid?: string;
  data?: IDocument;
}

export interface ITeamPayload {
  branchUuid?: string;
  corporateUuid?: string;
  scheduleUuid?: string;
  data?: ITeams;
}

export interface ITeams {
  uuid?: string;
  slotDuration: number;
  name: string;
  brands?: string[];
  weekdays: IWeekDays[];
  advisors: IAdvisors[];
  bookingLeadTime?: number;
}

export interface IAdvisors {
  uuid: string;
  name: string;
}

export interface IDaily {
  advisorUuid: string;
  advisorName: string;
  maxAppointments: string;
  slots: IDailySlots[];
}

export interface IDailySlots {
  startTime?: string;
  endTime?: string;
  numberOfAppointments?: number;
  teamSlotsMaxAppointments?: number;
}

export interface IWeekDays {
  active: boolean;
  day?: string;
  startTime?: string;
  endTime?: string;
  maxAppointments?: number;
  daily: IDaily[];
}

export enum SchedulesType {
  SALES = 'SALES',
  AFTER_SALES = 'AFTER SALES',
}

export interface IUpdate {
  name?: string;
  order?: number;
  email?: string;
  workshops?: IWorkshop[];
  location?: ILocation;
  landingPhone?: string;
  image?: string;
  payment?: IPayment;
  mapCoveragePostalCodes?: IMapCoveragePostalCode | any;
  configuration?: IConfiguration;
}

export interface IWorkshopId {
  mobileService?: string;
  serviceCenter?: string;
}

export interface IWorkshop {
  brand: string;
  name: IWorkshopId;
  id: IWorkshopId;
}

export interface IMapCoveragePostalCode {
  mobileService?: string[];
  testDrive?: string[];
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

export interface IPayment {
  sales?: IPaymentDetail;
  afterSales?: IPaymentDetail;
}

export interface IPaymentDetail {
  methods: IPaymentMethods[];
  currency: string;
}

export interface IPaymentMethods {
  type: string;
  default: boolean;
  gateways?: IGateway[];
}

export interface IGateway {
  name: string;
  access: IAccess;
}

export interface IAccess {
  serviceId: string;
  password: string;
  paymentGatewayUrl: string;
  merchantName: string;
  merchantCallbackUrl: string;
  merchantReturnUrl: string;
  apiKey: string;
  livePrefixUrl: string;
  secretKey: string;
  publishableKey: string;
  webhookSecretKey: string;
}

export interface ILocation {
  address: string;
  country: string;
  state: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  googlePlaceId?: string;
}

export interface GatewayEGHL {
  serviceId: string;
  password: string;
  merchantCallbackUrl?: string;
  merchantReturnUrl?: string;
}

export interface IGetCountry {
  uuid?: string;
  name?: string;
  codes: Codes;
  states: string[];
}

interface Codes {
  alpha2: string;
  alpha3: string;
  currency: string;
  calling: number;
}

export interface IOperationPayload {
  type: string;
  corporateUuid: string;
  branchUuid: string;
}

export interface IOffDaysDateAndTime {
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  onLeave: boolean;
}

export interface IOffDaysItem {
  uuid: string;
  reason: string;
  advisors: [{uuid: string, name: string}];
  dateAndTime: IOffDaysDateAndTime;
}

export interface IOffDaysPayload {
  branchUuid?: string;
  corporateUuid?: string;
  data?: IOffDaysItem;
}

export interface IOffDaysData {
  schedulesOffDays: IOffDays;
}

export interface IOffDays {
  docs: IOffDaysList[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}
export interface IOffDaysList {
  uuid: string;
  reason: string;
  advisors: [{ uuid: string; name: string }];
  onLeave: boolean;
  startDateAndTime: string;
  endDateAndTime: string;
}
export interface IConfig {
  page: number;
  limit: number;
}
export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}
