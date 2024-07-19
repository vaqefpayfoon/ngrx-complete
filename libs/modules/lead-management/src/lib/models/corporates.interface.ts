import { DownPaymentType } from './corporate.enum';

export enum Departments {
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  FINANCE = 'FINANCE',
  HR = 'HR',
  IT = 'IT',
  MARKETING = 'MARKETING',
  RESEARCH_AND_DEVELOP = 'RESEARCH_AND_DEVELOP',
  SALES = 'SALES',
  AFTER_SALES = 'AFTER_SALES',
  VALUE_MY_CAR = 'VALUE_MY_CAR',
  DELETE_CUSTOMER_ACCOUNT = 'DELETE_CUSTOMER_ACCOUNT',
  ENHANCE_ADD_VEHICLE = 'ENHANCE_ADD_VEHICLE',
  UVEYE_REQUEST = 'UVEYE_REQUEST',
}

// todo: remove it later (check account interface)
export const DocumentType = {
  SINGAPORE_NRIC: 'SINGAPORE_NRIC',
  FOREIGN_IDENTIFICATION_NUMBER: 'FOREIGN_IDENTIFICATION_NUMBER',
  FOREIGN_PASSPORT: 'FOREIGN_PASSPORT',
  MALAYSIA_NRIC: 'MALAYSIA_NRIC',
  INDONESIA_NRIC: 'INDONESIA_NRIC',
};

export enum Types {
  AUTHORIZED_DEALER = 'Authorized Dealer',
  RETAILER = 'Retailer',
  DEALER = 'Dealer',
}

export enum CalendarType {
  MOBILITY = 'Mobility',
  SERVICE = 'Service',
  REPAIR = 'Repair',
}

export enum CalendarTypeW {
  SERVICE = 'Service',
  REPAIR = 'Repair',
}

export enum AppFeatureTestDriveLoanTypes {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export const SocialAccounts = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  LINE: 'Line',
  LINKEDIN: 'Linkedin',
  PINTEREST: 'Pinterest',
  QQ: 'QQ',
  QZONE: 'QZone',
  REDDIT: 'Reddit',
  SKYPE: 'Skype',
  TELEGRAM: 'Telegram',
  TUMBLR: 'Tumblr',
  TWITTER: 'Twitter',
  WHATSAPP: 'WhatsApp',
  WECHAT: 'WeChat',
  YOUTUBE: 'Youtube',
};

export enum AppFeatureWidgetsTypes {
  TEST_DRIVE = 'TEST_DRIVE',
  LOCATIONS = 'LOCATIONS',
  LOAN_CALCULATOR = 'LOAN_CALCULATOR',
  LOAN_CALCULATOR_WEB = 'LOAN_CALCULATOR_WEB',
  MODELS = 'MODELS',
  SOS = 'SOS',
  ACCESSORIES = 'ACCESSORIES',
  PRE_OWNED = 'PRE_OWNED',
  SERVICE_APPOINTMENT = 'SERVICE_APPOINTMENT',
  I_SERVICE = 'I_SERVICE',
  PRE_OWNED_WEB = 'PRE_OWNED_WEB',
  VALUE_MY_CAR = 'VALUE_MY_CAR',
  CAR_DATA = 'CAR_DATA',
  INSURANCE_RENEWAL = 'INSURANCE_RENEWAL',
}

export enum ModelSaleFulfillmentType {
  DOCUMENT = 'DOCUMENT',
  CALENDAR = 'CALENDAR',
  DOWNPAYMENT = 'DOWNPAYMENT',
  RCO = 'RCO',
}

export enum AccountSynchronizations {
  RONIC = 'RONIC',
  SALESFORCE = 'SALESFORCE',
}

export enum InsuranceFormType {
  SINGAPORE = 'SINGAPORE',
  MALAYSIA = 'MALAYSIA',
  INDONESIA = 'INDONESIA',
}

export enum TradeInFormType {
  SINGAPORE = 'SINGAPORE',
  MALAYSIA = 'MALAYSIA',
  INDONESIA = 'INDONESIA',
}

export enum VehicleDetailsList {
  VEHICLE_DETAILS = 'VEHICLE_DETAILS',
  TIRE_SPECIFICATIONS = 'TIRE_SPECIFICATIONS',
  ALTERNATE_DRIVERS = 'ALTERNATE_DRIVERS',
  SERVICE_APPOINTMENTS = 'SERVICE_APPOINTMENTS',
  SERVICE_ORDERS = 'SERVICE_ORDERS',
  INSPECTION = 'INSPECTION',
  DRIVERS_GUIDE = 'DRIVERS_GUIDE',
}

export enum AppFeatureImages {
  RO_INVOICE_PAYMENT_SUCCESS = 'RO_INVOICE_PAYMENT_SUCCESS',
  RO_INVOICE_PAYMENT_FAIL = 'RO_INVOICE_PAYMENT_FAIL',
  SALE_PAYMENT_SUCCESS = 'SALE_PAYMENT_SUCCESS',
  SALE_PAYMENT_FAIL = 'SALE_PAYMENT_FAIL',
  TEST_DRIVE_BOOKING_SUCCESS = 'TEST_DRIVE_BOOKING_SUCCESS',
  TEST_DRIVE_BOOKING_FAIL = 'TEST_DRIVE_BOOKING_FAIL',
  INSURANCE_ENQUIRY_SUCCESS = 'INSURANCE_ENQUIRY_SUCCESS',
  VALUE_MY_CAR_SUCCESS = 'VALUE_MY_CAR_SUCCESS',
  RATING_MOBILE_SERVICE = 'RATING_MOBILE_SERVICE',
  RATING_SERVICE_CENTER = 'RATING_SERVICE_CENTER',
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

export interface ICreate {
  name: string;
  type: Types;
  image?: string;
  registrationNumber: string;
  description?: string;
  socialAccounts?: ISocialAccount[];
  peopleInCharge: IPeopleInCharge[];
  appIdentifiers?: string[];
  configuration: IConfiguration;
}

export interface IUpdate {
  name?: string;
  description?: string;
  type?: string;
  image?: string;
  registrationNumber?: string;
  socialAccounts?: ISocialAccount[];
  peopleInCharge?: IPeopleInCharge[];
  appIdentifiers?: string[];
  configuration?: IConfiguration;
}

export interface IDocument extends ICreate {
  uuid: string;
  file?: any;
  active: boolean;
}

export interface IPeopleInCharge {
  department: Departments;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
}

export interface ISocialAccount {
  account: string;
  url: string;
  icon?: string;
}

export interface IServiceCenterConfigurationService {
  title: string;
  calendarType: string | CalendarType;
  description: string;
  active: boolean;
}

export interface IConfigurationServices {
  serviceCenter: IServiceCenterConfigurationService[];
}

export interface IConfigurationReports {
  email: string;
}

export interface IAppointment {
  cancel: boolean;
  reschedule: boolean;
}

export interface IAppFeatureTestDrive {
  location: boolean;
  showRoom: boolean;
  questions?: string[];
  loanType: string | AppFeatureTestDriveLoanTypes;
  appointment: IAppointment;
}

export interface IAppFeatureSalesDetail {
  active: boolean;
  type?: TradeInFormType;
}

export interface IAppFeatureSalesTradeIn {
  active: boolean;
  type?: TradeInFormType;
}

export interface IAppFeatureSalesInsurance {
  active: boolean;
  type?: InsuranceFormType;
}

export interface IAppFeatureModelSales {
  tradeIn: IAppFeatureSalesTradeIn;
  insurance: IAppFeatureSalesInsurance;
  loan: IAppFeatureSalesDetail;
  active: boolean;
  bank: IAppFeatureModelSalesBank;
}

export interface IAppFeatureModelSalesBank {
  new?: IBank[];
  used?: IBank[];
}

export interface IBankScheme {
  name: string;
  uuid: string;
  logo: string;
  interestRate: number;
}
export interface IBank {
  name: string;
  uuid: string;
  logo: string;
  interestRate: number;
  isDefault: boolean;
  downPayment: IBankDowyPayment;
  period: IBankPeriods;
}

export interface IBankDowyPayment {
  type: DownPaymentType;
  amount: number;
}

export interface IBankPeriods {
  min: number;
  max: number;
}

export interface IAppFeatureModel {
  preOwnedModelUrl?: string;
  sale: IAppFeatureModelSales;
}

export type IConfigurationAppFeaturesImgaes = {
  [key in keyof typeof AppFeatureImages]: string;
};

export interface IAppImageUpload {
  url?: string;
  file?: File;
  corporateUuid: string;
}
export interface IAppImageUploadAction {
  file?: File;
  corporateUuid: string;
  key: AppFeatureImages;
}

export interface IConfigurationAppFeatures {
  account: IAppFeatureAccount;
  home: IAppFeatureHome;
  vehicle: IAppFeatureVehicle;
  service: IAppFeatureService;
  testDrive: IAppFeatureTestDrive;
  model: IAppFeatureModel;
  images?: IConfigurationAppFeaturesImgaes;
  widgets?: IAppFeatureWidgets[];
}

export interface IAppFeatureService {
  mobileService: boolean;
  serviceCenter: boolean;
  digitalInvoice: IAppFeatureInvoice;
}

export interface IAppFeatureInvoice {
  active: boolean;
}

export interface IAppFeatureAccountProfileDocumentTypes {
  key: string;
  value: string;
}

export interface IAppFeatureAccountProfileDocument {
  active: boolean;
  types: IAppFeatureAccountProfileDocumentTypes[];
}

export interface IAppFeatureAccountProfile {
  document: IAppFeatureAccountProfileDocument;
}

export interface IAppFeatureAccount {
  authentication: IAppFeatureAccountAuthentication;
  profile: IAppFeatureAccountProfile;
  salutations: string[];
}

export interface IAppFeatureAccountAuthentication {
  magicLink: boolean;
  social: IAppFeatureAccountAuthenticationSocial;
  custom: IAppFeatureAccountAuthenticationCustom;
}

export interface IAppFeatureAccountAuthenticationSocial {
  active: boolean;
  facebook: boolean;
  facebookAccessToken?: boolean;
  gmail: boolean;
  apple: boolean;
}

export interface IAppFeatureAccountAuthenticationCustom {
  active: boolean;
  myInfo: boolean;
}

export class IAppFeatureHomeHelpCenterEnquiry {
  active: boolean;
  divisions?: string[];
  topics?: string[];
}

export interface IAppFeatureHomeHelpCenterWhatsApp {
  active: boolean;
  phoneNumber: string;
  defaultMessage: string;
}

export interface IAppFeatureHomeHelpCenter {
  active: boolean;
  call: IHomeHelpCenterCall;
  enquiry: IAppFeatureHomeHelpCenterEnquiry;
  liveChat: boolean;
  whatsApp?: IAppFeatureHomeHelpCenterWhatsApp;
}

export interface IAppFeatureHomePanelDetails {
  active: boolean;
  mobileService?: IAppFeatureHomePanelDetailService;
  serviceCenter?: IAppFeatureHomePanelDetailService;
}
export interface IAppFeatureHomePanelDetailService {
  active?: boolean;
  isTrackAndChat?: boolean;
}
export interface IAppFeatureHomePanel {
  inProgress: IAppFeatureHomePanelDetails;
}

export interface IAppFeatureHomeInsuranceEnquiry {
  ncdEntitlement?: string[];
}

export interface IAppFeatureHomeDisplayAdditionalInformation {
  navigationBarAppLogo?: boolean;
  profileDetails?: boolean;
  enquiry?: boolean;
  wishList?: boolean;
  insuranceRenewal?: boolean;
  hotDealsList?: boolean;
}

export interface IAppFeatureHome {
  helpCenter: IAppFeatureHomeHelpCenter;
  panel: IAppFeatureHomePanel;
  insuranceEnquiry?: IAppFeatureHomeInsuranceEnquiry;
  displayAdditionalInformation?: IAppFeatureHomeDisplayAdditionalInformation;
}

export interface IHomeHelpCenterCall {
  generalLine: IHomeHelpCenterCallDetail;
  insurance: IHomeHelpCenterCallInsuranceDetail;
  roadSideAssist: IHomeHelpCenterCallDetail;
}

export interface IHomeHelpCenterCallDetail {
  active: boolean;
  number?: string;
}

export interface IHomeHelpCenterCallInsuranceDetail
  extends IHomeHelpCenterCallDetail {
  name?: string;
}

export interface IAppFeatureVehicleRegister {
  manual: boolean;
  myInfo: boolean;
  lta: boolean;
}

export interface IAppFeatureVehicleProfileVehicleDetails {
  active: boolean;
  vehicleSpecs: boolean;
  tyreSpecs: boolean;
  insurancePolicies: boolean; // would be removed in future
  alternateDrivers: boolean;
  tradeIn: IAppFeatureVehicleTradeIn;
  insurance: IAppFeatureVehicleProfileVehicleDetailsInsurance;
  warranty: IAppFeatureVehicleProfileVehicleDetailsWarranty;
  roadTax: IAppFeatureVehicleProfileVehicleDetailsRoadTax;
  list?: IAppFeatureVehicleProfileVehicleDetailsList[];
}

export interface IAppFeatureVehicleProfileVehicleDetailsList {
  name: VehicleDetailsList;
  order: number;
}

export interface IAppFeatureVehicleProfileVehicleDetailsInsurance {
  active: boolean;
  names?: string[];
}

export class IAppFeatureVehicleProfileVehicleDetailsWarranty {
  active: boolean;
}
export class IAppFeatureVehicleProfileVehicleDetailsRoadTax {
  active: boolean;
}

export interface IAppFeatureVehicleProfileServiceDetails {
  active: boolean;
  serviceHistories: boolean;
  inspectionDetails: boolean;
}
export interface IAppFeatureVehicleProfileExternalApps {
  active: boolean;
  bmwDriversGuide: boolean;
}

export interface IAppFeatureVehicleProfile {
  vehicleDetails: IAppFeatureVehicleProfileVehicleDetails;
  serviceDetails: IAppFeatureVehicleProfileServiceDetails;
  externalApps: IAppFeatureVehicleProfileExternalApps;
}

export interface IAppFeatureVehicleTradeIn {
  active: boolean;
  sources?: string[];
  type?: TradeInFormType;
  inspection?: IAppFeatureVehicleTradeInInspection;
}

export interface IAppFeatureVehicleTradeInInspection {
  active: boolean;
}

export interface IAppFeatureVehicleInsuranceForm {
  active: boolean;
  type?: InsuranceFormType;
}

export interface IAppFeatureVehicle {
  register: IAppFeatureVehicleRegister;
  profile: IAppFeatureVehicleProfile;
}

export interface ISalesforceAuthentication {
  subject: string;
  issuer: string;
}

export interface ISalesforceApiObject {
  url: string;
  active: boolean;
}

export interface ISalesforceWebhookVersions {
  version: string;
  url: string;
}

export interface ISalesforceWebHook {
  url: string;
  active: boolean;
  versions: ISalesforceWebhookVersions[];
}

export interface ISalesforceApi {
  getVehicleByNumberplate?: ISalesforceApiObject;
  accountSynchronization?: ISalesforceApiObject;
}

export interface IConfigurationSalesforce {
  authentication?: ISalesforceAuthentication;
  api?: ISalesforceApi;
  webHook?: ISalesforceWebHook;
  companyId: string;
  source: string;
  accountSynchronization?: ISalesforceAccountSynchronization;
}

export interface ISalesforceAccountSynchronization {
  active: boolean;
  company?: string;
  url?: string;
}

export interface ISubscriptionPlan {
  period?: any; // start , end , bill
  active?: boolean;
  cost?: any; // currency , total
  type?: string; // todo define plan types bronze , gold , custom , etc
  autoRenew?: boolean;
}

export interface IConfigurationSubscriptions {
  plan?: ISubscriptionPlan;
  modules?: ISubscriptionModules[];
}

export interface ISubscriptionModules {
  name: string;
  description?: string;
  key: string | SubscriptionModules;
  options?: any;
  subModules?: ISubscriptionSubModules[];
}

export interface ISubscriptionSubModules {
  name: string;
  description?: string;
  // @IsIn(Object.keys(SubscriptionModules)) // todo later we will defined sub modules
  key: string;
  options: any;
}

export enum SubscriptionModules {
  MOBILE_SERVICE = 'Mobile Service',
  SERVICE_CENTER = 'Service Center',
}

export interface IServiceCenterOptions {
  services: IServiceCenterConfigurationService[];
}

export interface IServiceCenterConfigurationService {
  title: string;
  calendarType: string;
  description: string;
  active: boolean;
}

export interface IConfigurationVehicles {
  coverages: IConfigurationVehicleCoverage[];
}

export interface IConfigurationVehicleCoverage {
  brand: string;
  mobileService: boolean;
  serviceCenter: boolean;
}

export interface IEmail {
  name: string;
  address: string;
  authentication: IEmailAuthentication;
}

export class IConfigurationLocale {
  countryCode: string;
}

export class IEmailAuthentication {
  username: string;
  password: string;
  port: number;
  host: string;
  ssl?: boolean;
}

export class IWatermark {
  active: boolean;
  image: string;
}

export interface IConfiguration {
  subscriptions?: IConfigurationSubscriptions;
  reports: IConfigurationReports;
  appFeatures: IConfigurationAppFeatures;
  salesforce?: IConfigurationSalesforce;
  email: IEmail;
  vehicles: IConfigurationVehicles;
  locale: IConfigurationLocale;
  web: IConfigurationWeb;
  model?: IConfigurationModel;
  synchronization?: IConfigurationSynchronization;
  reservation?: IConfigurationReservation;
  calendar?: IConfigurationCalendar;
  watermark?: IWatermark;
}

export interface IConfigurationCalendar {
  active: boolean;
  schema?: ICalendarSchema;
  services?: IConfigurationCalendarService[];
}

export interface ICalendarSchema {
  branches?: ICalendarSchemaBranch[];
}

export interface ICalendarSchemaBranch {
  uuid: string;
  mobility?: IMobilityConfig;
  repair?: IRepairConfig;
  service?: IServiceConfig;
}

export interface IServiceConfig {
  csoCount: number;
  days: IServiceDate;
}

export interface IServiceDate {
  monday?: IServiceDay;
  tuesday?: IServiceDay;
  wednesday?: IServiceDay;
  thursday?: IServiceDay;
  friday?: IServiceDay;
  saturday?: IServiceDay;
  sunday?: IServiceDay;
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

export interface IConfigurationCalendarService {
  type: Omit<CalendarType, 'MOBILITY'>;
  name: string;
  description?: string;
  includedTypes: string[];
}

export interface IMobilityConfig {
  days: IMobilityDate;
}

export interface IMobilityDate {
  monday?: IMobilityDay;
  tuesday?: IMobilityDay;
  wednesday?: IMobilityDay;
  thursday?: IMobilityDay;
  friday?: IMobilityDay;
  saturday?: IMobilityDay;
  sunday?: IMobilityDay;
}

export interface ICorporateCalendarDay {
  start: string;
  end: string;
}

export interface IMobilityDay extends ICorporateCalendarDay {
  session: IMobileServiceSession;
  break: ICorporateCalendarDay;
}

export interface IRepairConfig {
  csoCount: number;
  days: IRepairDate;
}

export interface IRepairDate {
  monday?: IRepairDay;
  tuesday?: IRepairDay;
  wednesday?: IRepairDay;
  thursday?: IRepairDay;
  friday?: IRepairDay;
  saturday?: IRepairDay;
  sunday?: IRepairDay;
}

export interface IRepairDay extends ICorporateCalendarDay {
  session: IRepairSession;
  break: ICorporateCalendarDay;
  bay: ICalendarBay;
}

export interface IRepairSession {
  serviceTime: number;
  meeting: IRepairSessionMeeting;
}

export interface IRepairSessionMeeting extends ICorporateCalendarDay {
  duration: number;
}

export interface IServiceMeeting {
  duration: number;
}

export interface ICalendarBay {
  count: number;
}

export interface IMobileServiceSession {
  travelTime: number;
  serviceTime: number;
}

export interface IConfigurationReservation {
  repairOrder: IReservationSignature;
  invoice: IReservationSignature;
}

export class IReservationSignature {
  signature: ISignature;
}

export interface ISignature {
  position: IModelSaleFulfillmentDocumentSignaturePosition;
}

export interface IConfigurationSynchronization {
  active: boolean;
  account?: IConfigurationSynchronizationAccount;
}

export interface IConfigurationSynchronizationAccount {
  active: true;
  type?: AccountSynchronizations;
}

export interface IConfigurationWeb {
  redirection: IConfigurationRedirection;
}

export interface IConfigurationRedirection {
  success: string;
  error: string;
}

export interface IConfigurationModel {
  active: boolean;
  sale: IModelSale;
}

export interface IModelSale {
  userFulfillments: IModelSaleUserFulfillment[];
  fulfillments: IModelSaleFulfillment[];
}

export interface IModelSaleFulfillment {
  title?: string;
  order?: number;
  description?: string;
  type?: ModelSaleFulfillmentType;
  document?: IModelSaleFulfillmentDocument;
  calendar?: IModelSaleFulfillmentRequirement;
  downPayment?: IModelSaleDownPaymentFulfillment;
  rco?: IModelSaleFulfillmentRCO;
}

export interface IModelSaleDownPaymentFulfillment {
  payment?: IDownPaymentFulfillmentPayment;
}

export interface IDownPaymentFulfillmentPayment {
  currency?: string;
}

export interface IModelSaleFulfillmentRCO
  extends IModelSaleFulfillmentRequirement {
  signature: IModelSaleFulfillmentDocumentSignature;
}

export interface IModelSaleFulfillmentRequirement {
  isRequired: boolean;
}

export interface IModelSaleFulfillmentDocument
  extends IModelSaleFulfillmentRequirement {
  signature: IModelSaleFulfillmentDocumentSignature;
  payment: IModelSaleFulfillmentRequirement;
}

export interface IModelSaleFulfillmentDocumentSignaturePosition {
  x: number;
  y: number;
  page: number;
}

export interface IModelSaleFulfillmentDocumentSignature
  extends IModelSaleFulfillmentRequirement {
  position?: IModelSaleFulfillmentDocumentSignaturePosition;
}

export interface IModelSaleUserFulfillment {
  title: string;
  order: number;
  document: IModelSaleFulfillmentRequirement;
  description?: string;
}

export interface IAppFeatureWidgets {
  name: string;
  type: AppFeatureWidgetsTypes;
  icon: string;
  order: number;
  active: boolean;
  url?: string;
}
export interface IAppFeatureReminder {
  active: boolean;
  displayDays: number;
}