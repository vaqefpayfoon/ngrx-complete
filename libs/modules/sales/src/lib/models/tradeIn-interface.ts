import { IAccount } from '@neural/modules/administration';
import { ICorporate } from './sales.interface';

export enum CustomerDecision {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum OfferStatus {
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  IN_PROCESS = 'IN_PROCESS',
}

export enum FileType {
  IMAGE = 'image',
  IMAGE_PNG = 'image/png',
  IMAGE_JPG = 'image/jpg',
  TEXT = 'plain/text',
  HTML = 'text/html',
  PDF = 'application/pdf',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export interface IUnit {
  brand: string;
  model: string;
  variant: string;
  display?: string;
}

export interface IInspectionOffer {
  finalValue: number;
  validity: string;
  valuation: IValuation;
  remark?: string;
  customerDecision?: CustomerDecision;
  isLocked: boolean;
}

export interface IInspectionRequest {
  date: string;
  remark: string;
}

export interface IInspection {
  request?: IInspectionRequest;
  offer?: IInspectionOffer;
}

export interface IValuation {
  title: string;
  url: string;
  mime: FileType;
  size: number;
}

export interface IOffer {
  customerDecision?: CustomerDecision;
  isLocked: boolean;
  approximateValue: number;
  status: OfferStatus;
  validity: string;
  valuation: IValuation;
  remark?: string;
}

export interface ICreate {
  unit: IUnit;
  documents: IDocument[];
  numberPlate: string;
  manufacturerYear: number;
  saleUuid?: string;
  mileage: number;
  accountUuid: string;
  corporateUuid: string;
  remark?: string;
}

export interface ITradeInDocumnet extends ICreate {
  active: boolean;
  account: ITradeInAccount;
  uuid: string;
  offer: IOffer;
  inspection: IInspection;
  corporate: ICorporate;
  createdAt?: string;
}

export interface IDocument {
  title?: string;
  url: string;
  size?: number;
  mime?: FileType;
}

export interface ITradeInAccount {
  email?: string;
  uuid?: string;
  identity?: IAccount.IIdentity;
  phone: IAccount.IPhone;
  image?: string;
  uid?: string;
}
export class IUpdate {
  unit?: IUnit;
  documents?: IDocument[];
  numberPlate?: string;
  manufacturerYear?: number;
  saleUuid?: string;
  mileage?: number;
  offer?: IOffer;
  inspection?: IInspection;
  customerDecision?: CustomerDecision;
  remark?: string;
}
