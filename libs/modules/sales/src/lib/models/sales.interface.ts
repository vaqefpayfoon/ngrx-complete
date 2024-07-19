import { Auth } from '@neural/auth';
import { IBranches, ICorporates } from '@neural/modules/customer/corporate';

export enum Status {
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  BOOKING_ON_HOLD = 'BOOKING_ON_HOLD',
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

export enum LtaDocumentTypes {
  BUSINESS = 'BUSINESS',
  ORGANIZATION = 'ORGANIZATION',
  COMPANY = 'COMPANY',
  FOREIGN_COMPANY = 'FOREIGN_COMPANY',
  FOREIGN_IDENTIFICATION_NUMBER = 'FOREIGN_IDENTIFICATION_NUMBER',
  FOREIGN_PASSPORT = 'FOREIGN_PASSPORT',
  GOVERNMENT = 'GOVERNMENT',
  LIMITED_LIABILITY_PARTNERSHIP = 'LIMITED_LIABILITY_PARTNERSHIP',
  LIMITED_PARTNERSHIP = 'LIMITED_PARTNERSHIP',
  MALAYSIA_NRIC = 'MALAYSIA_NRIC',
  PROFESSIONAL = 'PROFESSIONAL',
  SINGAPORE_NRIC = 'SINGAPORE_NRIC',
  STATUTORY_BOARD = 'STATUTORY_BOARD',
}

export enum TradeInUploadTitleType {
  REGISTRATION_CARD = 'REGISTRATION_CARD',
  ADDITIONAL_DOCUMENT_ONE = 'ADDITIONAL_DOCUMENT_ONE',
  ADDITIONAL_DOCUMENT_TWO = 'ADDITIONAL_DOCUMENT_TWO',
}

export enum UploadLoanDocumnetTypes {
  IDENTIFICATION_DOCUMENT = 'IDENTIFICATION_DOCUMENT',
  INCOME_PROOF = 'INCOME_PROOF',
  ADDITIONAL_DOCUMENT = 'ADDITIONAL_DOCUMENT',
}

export const uploadTitleType = {
  ...TradeInUploadTitleType,
  ...UploadLoanDocumnetTypes,
};

export enum UploadLocationType {
  TRADE_IN = 'TRADE_IN',
  ADDITIONAL = 'ADDITIONAL',
  TRADE_IN_INSPECTION_OFFER = 'TRADE_IN_INSPECTION_OFFER',
  TRADE_IN_OFFER = 'TRADE_IN_OFFER',
}

export enum ValuationTitle {
  VALUATION_DOCUMENT = 'VALUATION_DOCUMENT',
}

export enum SaleUserFulfillmentStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
}

export enum SaleFulfillmentDocumentStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
}

export enum SaleFulfillmentCalendarStatus {
  PENDING = 'PENDING',
  SET = 'SET',
}

export enum SaleFulfillmentSignatureStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
}
export enum PaymentMethod {
  // CASH = 'CASH' ,
  ONLINE_BANKING = 'ONLINE_BANKING',
}

export enum PaymentGateway {
  EGHL = 'EGHL',
  MIDTRANS = 'MIDTRANS',
}

export enum DepositTypes {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export enum ModelSaleFulfillmentType {
  DOCUMENT = 'DOCUMENT',
  CALENDAR = 'CALENDAR',
}

export enum MalaysiaTradeInBrand {
  BMW = 'BMW',
  MINI = 'MINI',
  MOTORRAD = 'MOTORRAD',
  OTHERS = 'OTHERS',
}

export enum TradeInFormType {
  SINGAPORE = 'SINGAPORE',
  MALAYSIA = 'MALAYSIA',
  INDONESIA = 'INDONESIA',
}

export enum InsuranceFormType {
  SINGAPORE = 'SINGAPORE',
  MALAYSIA = 'MALAYSIA',
  INDONESIA = 'INDONESIA',
}

export enum MalaysiaDocumentType {
  NRIC = 'NRIC',
  PASSPORT = 'PASSPORT',
  COMPANY_REGISTRATION_NUMBER = 'COMPANY_REGISTRATION_NUMBER',
}

export type ICorporate = Pick<ICorporates.IDocument, 'uuid' | 'name'>;

export type IBranch = Pick<IBranches.IDocument, 'uuid' | 'name'> &
  Record<'currency', string>;

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

export interface IConfig {
  page: number;
  limit: number;
  corporateUuid?: string;
}

export interface ISalesAdvisorConfig {
  page: number;
  limit: number;
}

export interface ISalesAdvisorData {
  docs: Auth.IAccount[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IDocument {
  uuid: string;
  active: boolean;
  remark?: string;
  referenceNumber: string;
  status: string | Status;
  account: IReservationAccount;
  branch: IBranch;
  corporate: ICorporate;
  deposit: ISalesDeposit;
  option?: Option;
  payment: Payment;
  model: ISaleModel;
  saleAdvisor?: ISaleAdvisor;
  userFulfillments?: ISaleUserFulfillment[];
  fulfillments?: ISaleFulfillment[];
  saleAdvisorUuid?: string;
}

export interface ISaleAdvisor {
  uuid: string;
  identity: IIdentity;
  email: string;
  phone: IPhone;
  image?: string;
}

export interface IUnit {
  brand: string;
  model: string;
  display: string;
  variant: string;
  actualVariant: string;
  actualModel: string;
  series: string;
}

export interface IReservationAccount {
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

export interface ISalesDeposit {
  type: DepositTypes;
  amount: number;
}

export interface Option {
  tradeInFormType?: TradeInFormType | string;
  tradeInForm?: ITradeInForm;
  insuranceFormType?: InsuranceFormType | string;
  insuranceForm?: IInsuranceForm;
  loan?: Loan;
}

export interface IInsuranceForm
  extends SingaporeInsuranceForm,
    MalaysiaInsuranceForm {}
export interface ITradeInForm
  extends SingaporeTradeInForm,
    MalaysiaTradeInForm {}

export interface SingaporeInsuranceForm {
  drivingExperience?: number;
  issuanceDate?: string; // not iso
  age?: number;
  numberPlate?: string;
}

export interface MalaysiaInsuranceForm {
  documentID?: string;
  documentType?: MalaysiaDocumentType;
  numberPlate?: string;
}

export interface SingaporeTradeInForm {
  documentID?: string;
  documentType?: LtaDocumentTypes;
  numberPlate?: string;
  mileage?: number;
  source?: string;
}

export class MalaysiaTradeInForm {
  model?: string;
  brand?: MalaysiaTradeInBrand;
  numberPlate?: string;
  identificationNumber?: string;
  manufacturerYear?: string;
}

export interface TradeIn {
  plateNumber?: string;
  brand?: string;
  model?: string;
  manufacturerYear?: number;
  mileage?: number;
  vin?: string;
}

export interface Loan {
  price: number;
  downPayment: number;
  period: number;
  interestRate: number;
}

export interface Payment {
  method: string | PaymentMethod;
  currency: string;
  gateway?: string | PaymentGateway;
  status: string | PaymentStatus;
  payload?: object;
  payableAmount: number;
}

export interface ISpecs {
  key: string;
  value: string;
  image?: string;
}

export interface IRangeNumber {
  min: number;
  max: number;
}

export interface IPromotion {
  image: string;
  title: string;
  description: string;
  discount: ISalesDeposit;
}

export interface ILoan {
  minDownPayment?: number;
  period: IRangeNumber;
  interestRate: number;
}

export interface ISaleModel {
  uuid: string;
  type: string;
  unit: IUnit;
  specs: ISpecs[];
  price?: number;
  promotion?: IPromotion;
  loan?: ILoan;
}

export interface IUuid {
  uuid: string;
}

export interface IUid {
  uid: string;
}

export interface IFulfillment extends IUuid {
  fulfillmentUuid: string;
}

export interface ISaleUserFulfillmentDocument
  extends IModelSaleFulfillmentRequirement {
  status: SaleFulfillmentDocumentStatus;
  url?: string;
}

export interface ISaleUserFulfillment extends IModelSaleUserFulfillment {
  uuid: string;
  document: ISaleUserFulfillmentDocument;
}

export interface ISaleFulfillmentDocument
  extends IModelSaleFulfillmentDocument {
  status: SaleFulfillmentDocumentStatus;
  url?: string;
  signature: ISaleFulfillmentSignature;
  payment: ISaleFulfillmentPayment;
}

export interface ISaleFulfillmentCalendar
  extends IModelSaleFulfillmentRequirement {
  status: SaleFulfillmentCalendarStatus;
  date?: string;
}

export interface IModelSaleFulfillmentRequirement {
  isRequired: boolean;
}

export interface IModelSaleUserFulfillment {
  title: string;
  order: number;
  document: IModelSaleFulfillmentRequirement;
  description?: string;
}

export interface UpdateSaleFulfillmentSignaturePosition {
  x: number;
  y: number;
  page: number;
}

export interface ISaleFulfillmentSignature
  extends IModelSaleFulfillmentRequirement {
  status: SaleFulfillmentSignatureStatus;
  position: UpdateSaleFulfillmentSignaturePosition;
  url?: string;
}

export interface ISaleFulfillmentSignaturePosition {
  x: number;
  y: number;
  page: number;
}

export interface ISaleFulfillmentPayment
  extends IModelSaleFulfillmentRequirement {
  status: PaymentStatus;
  payload?: Record<string, any>;
  method: PaymentMethod;
  currency: string;
  gateway?: PaymentGateway;
  payableAmount?: number;
}

export interface IModelSaleFulfillmentDocument
  extends IModelSaleFulfillmentRequirement {
  signature: IModelSaleFulfillmentRequirement;
  payment: IModelSaleFulfillmentRequirement;
}

export interface IModelSaleFulfillmentRequirement {
  isRequired: boolean;
}

export interface ISaleFulfillment extends IModelSaleFulfillment {
  uuid: string;
  isLocked: boolean;
  file?: any;
  document?: ISaleFulfillmentDocument;
  calendar?: ISaleFulfillmentCalendar;
}

export interface IModelSaleFulfillment {
  title: string;
  order: number;
  description?: string;
  type: ModelSaleFulfillmentType;
  document?: IModelSaleFulfillmentDocument;
  calendar?: IModelSaleFulfillmentRequirement;
}

export interface IUpdate {
  status?: Status;
  saleAdvisorUuid?: string;
  remark?: string;
  price?: number;
  numberPlate?: string;
}

export interface ISearch {
  tradeIn?: ISearchOffer;
  bankLoan?: ISearchStatus;
  status?: string;
  remark?: string;
  payment?: ISearchStatus;
  branch?: ISearchUuid;
  corporate?: string;
  referenceNumber?: string;
  account?: ISearchAccount;
}

export interface ISearchAccount {
  email?: string;
}

export interface ISearchUuid {
  uuid?: string;
}

export interface ISearchStatus {
  uuid?: string;
}

export interface ISearchOffer {
  offer?: ISearchStatus;
}

export interface IUploadFile {
  accountUuid: string;
  saleUuid?: string;
  type: UploadLocationType;
  title: string;
  file: File;
}

export interface IDeleteFile {
  uuid: string;
  url: string;
  type: string;
  saleUuid?: string;
}

export interface IDeleteFileResponse extends IDeleteFile {
  message: string;
}

export const Filter = {
  like: [
    'saleAdvisor.uuid',
    'tradeIn.offer.status',
    'bankLoan.status',
    'status',
    'remark',
    'payment.status',
    'branch.uuid',
    'corporate.uuid',
    'referenceNumber',
    'account.email',
  ],
  range: ['createdAt', 'updatedAt'],
  boolean: ['isFeatured'],
};

export interface IReportData {
  [name: string]: {
    url: string;
  };
}
