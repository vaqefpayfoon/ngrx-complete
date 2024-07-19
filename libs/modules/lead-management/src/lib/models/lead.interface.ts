import { ICorporates } from '@neural/modules/customer/corporate';
import { ILeadNotes } from '.';

export interface IDocument {
  uuid: string;
  accountUuid: string;
  createdAt?: string;
  fullName?: string;
  email?: string;
  nationality: string;
  dateOfBirth: string;
  monthlyIncome: number;
  corporate: ICorporate;
  source: ISource;
  salesAdvisor: ISalesAdvisor;
  account: ISalesAdvisor;
  status: string;
  priority: string;
  notes: ILeadNotes.Notes[];
  advisorAssigned: boolean;
  reminder: Reminder;
  isManuallyClosed: boolean;
}
export type ICorporate = Pick<ICorporates.IDocument, 'uuid' | 'name'>;
export type ISource = Record<'type', SourceTypes> &
  Record<'origin', SourceOrigins> &
  Partial<Record<'tags', Array<string>>>;
export interface ISalesAdvisor {
  uuid: string;
  uid: string;
  email: string;
  identity: IIdentity;
  phone: IPhone;
  active: boolean;
}
export interface Reminder {
  createdAt?: Date;
  isManuallyInvited?: boolean;
  datesAndTimes: Date[];
  manualInvitations: ManualInvitations[];
}
export interface ManualInvitations {
  name?: string;
  dateAndTime?: Date;
}
export interface IAccount {
  email: string;
  account: IAccount;
  identity: IIdentity;
  phone: IPhone;
  dateOfBirth?: string;
  nationality?: string;
  monthlyIncome?: number;
}
export interface IPhone {
  code: string;
  number: string;
}
export interface IIdentity {
  salutation: string;
  fullName: string;
}
export enum Config {
  LIMIT = 10,
}
export interface IData {
  docs: IDocument[];
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
export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}
export interface IFilter {
  [key: string]: any;
}

export interface ISort {
  [key: string]: any;
}
export interface ISearchAccount {
  email?: string;
  nationality?: string;
}
export interface ISearch {
  account?: ISearchAccount;
  uuid?: string;
  status: string;
}

export enum SourceTypes {
  SOCIAL = 'SOCIAL',
  INVITATION = 'INVITATION',
  SIGN_UP = 'SIGN_UP',
  WEB = 'WEB',
  API = 'API',
}
export enum SourceOrigins {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  MYINFO = 'MYINFO',
  NERV = 'NERV',
  EMAIL = 'EMAIL',
}

export enum Status {
  PENDING = 'PENDING',
  ACTIVATED = 'ACTIVATED',
  CLOSED = 'CLOSED',
}
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  NO_PRIORITY = 'NO_PRIORITY',
}
export class ICreate {
  email: string;
  fullName?: string;
  salesAdvisorUuid?: string;
  corporateUuid: string;
}
export interface SA {
  corporate: string;
  branch: string;
  brand?: string;
}
export class IUpdate {
  salesAdvisorUuid?: string;
  nationality?: string;
  dateOfBirth?: string;
  monthlyIncome?: number;
  note?: string;
  priority?: Priority;
  status?: Status
}