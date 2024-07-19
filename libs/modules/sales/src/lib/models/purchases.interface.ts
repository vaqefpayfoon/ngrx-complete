import * as ISales from './sales.interface';
import { ITradeInDocumnet, OfferStatus } from './tradeIn-interface';
import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { IReservations } from '@neural/modules/jobs';
import { IModels } from '@neural/modules/models';
import { IPromotions } from '@neural/modules/rewards';
import { IAccount, ISalesAdvisor } from '@neural/modules/administration';

export enum BadgeSection {
  PURCHASE = 'purchase',
  SALES_ADVISOR = 'salesAdvisor',
  TRADE_IN = 'tradeIn',
  LOAN = 'loan',
  RETAIL_CUSTOMER_ORDER = 'retailCustomerOrder',
  HIRE_PURCHASE = 'hirePurchase',
  DOWN_PAYMENT = 'downPayment',
  REGISTERATION_CARD = 'registerationCard',
  INSURANCE = 'insurance',
  COLLECTION_DELIVERY = 'collectionDelivery',
}

export enum SaleFulfillmentDocumentStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  SIGNED = 'SIGNED',
}

export enum SaleFulfillmentSignatureStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
}

export enum SaleFulfillmentCalendarStatus {
  PENDING = 'PENDING',
  SET = 'SET',
}

export enum SaleFulfillmentRcoStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  SIGNED = 'SIGNED',
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

export enum SAPaymentStatus {
  REQUIRED = 'REQUIRED',
  CANCELED = 'CANCELED',
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
}

export enum CalendarStatus {
  READY_FOR_COLLECTION = 'READY_FOR_COLLECTION',
  COLLECTED = 'COLLECTED',
  COMPLETED = 'COMPLETED',
}

export enum DownPaymentTrigger {
  RCO = 'RCO',
  TRADE_IN = 'TRADE_IN',
  BOOKING_FEE = 'BOOKING_FEE',
  APPROVED_LOAN = 'APPROVED_LOAN',
}

export enum DownPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum CollectionType {
  DELIVERY = 'DELIVERY',
  SERVICE_CENTER = 'SERVICE_CENTER',
}

export enum ResultType {
  EXCEL = 'EXCEL',
  JSON = 'JSON',
}

export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IMidtransPayload {
  approval_code?: string;
  bank?: string;
  currency?: string;
  finish_redirect_url?: string;
  fraud_status?: string;
  gross_amount?: string;
  masked_card?: string;
  order_id?: string;
  payment_type?: string;
  point_balance?: number;
  point_redeem_amount?: number;
  secure_token?: boolean;
  status_code?: string;
  status_message?: string;
  transaction_id?: string;
  transaction_status?: string;
  transaction_time?: string;
}

export type IEGHLPayload = IReservations.IPaymentCallback;

export type ISalePayload = IEGHLPayload | IMidtransPayload;

export interface IPayment {
  method: string | IBranches.MethodNames;
  currency: string;
  gateway?: string | IBranches.GatewaysName;
  status: string | IBranches.PaymentStatus;
  payload?: ISalePayload;
  payableAmount: number;
}

export interface IPaymentDocument extends IPayment {
  paidAmount?: number;
  paymentMethod?: string;
  receiptId?: string;
  transactionDate?: string;
}

export interface IOption {
  tradeInFormType?: ISales.TradeInFormType | string;
  tradeInForm?: ISales.ITradeInForm;
  insuranceFormType?: ISales.InsuranceFormType | string;
  insuranceForm?: ISales.IInsuranceForm;
  loan?: ISales.Loan;
}

export interface ISaleModel {
  uuid: string;
  type: string;
  unit: IModels.IUnit & { brandImage?: string };
  specs: IModels.ISpecs[];
  price: number;
  promotion?: IPromotions.IDocument;
  loan?: IModels.IDocument;
  exterior?: IModels.IGalleryDetail;
  interior?: IModels.IGalleryDetail;
}

export interface IBadge {
  purchase: boolean;
  salesAdvisor: boolean;
  tradeIn: boolean;
  loan: boolean;
  retailCustomerOrder: boolean;
  hirePurchase: boolean;
  downPayment: boolean;
  registerationCard: boolean;
  insurance: boolean;
  collectionDelivery: boolean;
}

export interface IDocument {
  uuid: string;
  active: boolean;
  status: ISales.Status | string;
  option?: IOption;
  remark?: string;
  branch: ISales.IBranch;
  payment: IPaymentDocument;
  corporate: ISales.ICorporate;
  model: ISaleModel;
  account: IAccount.IReservationAccount;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
  tradeIn: ITradeInDocumnet;
  salesAdvisor: ISalesAdvisor.ISADocument;
  saleAdvisorUuid?: string;
  price?: number;
  deposit: ISales.ISalesDeposit;
  badge: IBadge;
  badgeTotal: number;
  numberPlate: string;
  fulfillments?: ISaleFulfillment[];
}

export interface IUpdate {
  saleAdvisorUuid?: string;
  remark?: string;
  price?: number;
  model?: IModel;
  numberPlate?: string;
  payment?: Pick<IPaymentDocument, 'payableAmount' | 'receiptId'>;
}

export interface IModel {
  uuid: string;
  exteriorColor: string;
  interiorColor: string;
}

export interface IRemark {
  remark: string;
}

export interface IUpdateBadge {
  section: BadgeSection;
  uuid: string;
}

export type CorporateModelSaleFulfillment = Pick<
  ICorporates.IModelSaleFulfillment,
  'type' | 'title' | 'calendar' | 'description' | 'document' | 'order' | 'rco'
>;

export interface ISaleFulfillment extends CorporateModelSaleFulfillment {
  uuid?: string;
  isLocked?: boolean;
  document?: ISaleFulfillmentDocument;
  calendar?: ISaleFulfillmentCalendar;
  downPayment?: ISaleFulfillmentDownPayment;
  rco?: ISaleFulfillmentRco;
  file?: File;
}

export interface ISaleFulfillmentDocument
  extends ICorporates.IModelSaleFulfillmentDocument {
  status: SaleFulfillmentDocumentStatus;
  url?: string;
  signature: ISaleFulfillmentSignature;
  isPDF?: boolean;
}

export interface ISaleFulfillmentSignature
  extends ICorporates.IModelSaleFulfillmentRequirement {
  status: SaleFulfillmentSignatureStatus;
  position: UpdateSaleFulfillmentSignaturePosition;
  url?: string;
}

export interface UpdateSaleFulfillmentSignaturePosition {
  x: number;
  y: number;
  page: number;
}

export type Location = Pick<
  IBranches.ILocation,
  'address' | 'latitude' | 'longitude'
>;

export interface ISaleFulfillmentCalendar
  extends ICorporates.IModelSaleFulfillmentRequirement {
  date?: string;
  branchUuid?: string;
  location?: Location;
  isCollected?: boolean;
  collectionType?: CollectionType;
  remark?: string;
}

export interface ISaleFulfillmentDownPayment
  extends ICorporates.IModelSaleFulfillmentRequirement {
  payment: ISaleFulfillmentPayment;
  breakDown: IModelSaleDownPaymentBreakdownFulfillment;
  status?: DownPaymentStatus;
}

export type SalePayload = IEGHLPayload | IMidtransPayload;

export interface ISaleFulfillmentPayment
  extends ICorporates.IModelSaleFulfillmentRequirement {
  status: SAPaymentStatus;
  method: IBranches.PaymentTypes;
  currency: string;
  payload: SalePayload;
  gateway?: IBranches.GatewaysName;
  payableAmount?: number;
  remark?: string;
  receiptNumber?: string;
}

export interface IDownloadReport {
  corporateUuid: string;
  branchUuid: string;
  resultType: ResultType;
  saleStatus?: ISales.Status;
  tradeInStatus?: OfferStatus;
  referenceNumber?: string;
  startDate?: string;
  endDate?: string;
  email?: string;
}

export interface IModelSaleDownPaymentBreakdownFulfillment {
  finalPurchasePrice?: number;
  finalTradeInValue?: number;
  approvedLoan?: number;
  bookingFeePaid?: number;
  insuranceAndRoadTax?: number;
  otherFees?: number;
  balanceDownpaymentDue?: number;
}

export interface ISaleFulfillmentRco
  extends ICorporates.IModelSaleFulfillmentDocument {
  status: SaleFulfillmentRcoStatus;
  url?: string;
  signature: ISaleFulfillmentSignature;
  isPDF?: boolean;
  finalValue: number;
}

export interface ISaleUserFulfillment
  extends ICorporates.IModelSaleUserFulfillment {
  uuid: string;
  document: ISaleUserFulfillmentDocument;
}

export interface ISaleUserFulfillmentDocument
  extends ICorporates.IModelSaleFulfillmentRequirement {
  status: SaleFulfillmentDocumentStatus;
  url?: string;
  isPDF?: boolean;
}

export const isEGHL = (payload: ISalePayload): payload is IEGHLPayload => {
  return (payload as IEGHLPayload).OrderNumber !== undefined;
};

export const isIMidtrans = (
  payload: ISalePayload
): payload is IMidtransPayload => {
  return (payload as IMidtransPayload).order_id !== undefined;
};
