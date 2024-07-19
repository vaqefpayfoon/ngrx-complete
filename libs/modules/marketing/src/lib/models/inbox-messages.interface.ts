import { Auth } from '@neural/auth';

export enum MessageType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  NEW_BOOKING = 'NEW_BOOKING',
  PROMOTION = 'PROMOTION',
  REMINDER = 'REMINDER',
  WELCOME = 'WELCOME',
  CAMPAIGN = 'CAMPAIGN',
  NOTIFICATION_INVOICE = 'NOTIFICATION_INVOICE',
}

export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IAccountData {
  docs: Auth.IAccount[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum Config {
  LIMIT = 10,
  UNLIMITED = 1000,
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

export interface IFilter {
  [name: string]: any;
}

export interface IDocument {
  uuid: string;
  type: string;
  payload: IPayload;
  isActive: boolean;
  viewRate?: string;
}

export interface IPayload {
  title: string;
  description: string;
  htmlBody?: string;
  campaignUuid?: string;
}
export interface ICreate {
  type: MessageType | string;
  corporateUuid: string;
  payload: IPayload;
}

export interface ISearch {
  title?: string;
  type?: MessageType;
  searchType?: SearchType
}

export enum SearchType {
  Email = 'Email',
  AccountId = 'AccountId',
}
