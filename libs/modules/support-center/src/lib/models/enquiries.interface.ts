export enum Subjects {
  SALES_FEEDBACK = 'SALES_FEEDBACK',
  PRODUCT_INFORMATION = 'PRODUCT_INFORMATION',
  PRODUCT_FEEDBACK = 'PRODUCT_FEEDBACK',
  CORPORATE_FEEDBACK = 'CORPORATE_FEEDBACK',
  AFTER_SALES_FEEDBACK = 'AFTER_SALES_FEEDBACK',
  CUSTOMER_SERVICE_FEEDBACK = 'CUSTOMER_SERVICE_FEEDBACK',
  VEHICLE_RELATED_FEEDBACK = 'VEHICLE_RELATED_FEEDBACK',
  OTHERS = 'OTHERS',
}

export enum Statuses {
  RECEIVED = 'RECEIVED',
  IN_REVIEW = 'IN_REVIEW',
  CLOSED = 'CLOSED',
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

export interface ISort {
  [key: string]: any;
}

export interface IFilter {
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
}

export interface ICreate {
  name: string;

  phone: IPhone;

  email: string;

  subject: string;

  details: string;

  division: string;
}

export interface IDocument extends ICreate {
  uuid: string;

  corporateUuid: string;

  status: string;

  comment: string;
  
  referenceNumber?: string;
}

export interface IUpdate {
  status: string;

  comment: string;
}

export interface IPhone {
  code: string;

  number: string;
}

export const Filter = {
  like: {
    status: Statuses,
  },
};
