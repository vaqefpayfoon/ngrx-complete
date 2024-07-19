import { Auth } from "@neural/auth";
import { IVehicle } from '@neural/modules/customer/vehicles';
export enum Types {
  MOBILE_SERVICE_FEE = 'MOBILE_SERVICE_FEE',
  INVOICE_FEE = 'INVOICE_FEE',
}

export enum DiscountTypes {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}


export enum CustomerEligibilityTypes {
  ALL = 'All',
  UUID = "Filter By Customer's Account",
}

export enum VehicleEligibilityTypes {
  ALL = 'All',
  VIN = "Filter By Customer's Vehicle",
  BRANDS = 'Filter by Brands',
}

export enum MileageEligibilityTypes {
  ALL = 'All',
  MILEAGE = 'Filter by Mileage',
}

export interface IVehicleData {
  docs: IVehicle[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}
export interface IVehicle {
  identificationNumber: string;
  uuid: string;
}

export interface IDate {
  start: string;
  // end date should later than start
  end: string;
}

export interface IDiscount {
  type: DiscountTypes;
  amount: number;
}

export interface IEligibilityVehiclesBrand {
  brand: string;
  models?: string[];
}

export interface IEligibilityVehicles {
  vins?: IVehicle.IDocument[];
  brands?: IEligibilityVehiclesBrand[];
}

export interface IEligibilityCustomers {
  uuids?: Auth.IAccount[];
  emails?: string[];
}

export interface IEligibility {
  vehicles?: IEligibilityVehicles;
  customers?: IEligibilityCustomers;
  mileages?: IEligibilityMileages[];
}

export class IEligibilityMileages {
  from: number;
  to: number;
}

export interface IUuid {
  uuid: string;
}

export interface ICodeValidation {
  // min: 3, Max: 12
  code: string;
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
  corporateUuid?: string,
  page: number;
  limit: number;
}

export interface IFilter {
  [key: string]: string;
}
export interface ISort {
  [key: string]: any;
}

export interface ICreate {
  // transfrom to uppercase
  code?: string;
  corporateUuid?: string;
  shortDescription?: string;
  eligibility?: IEligibility;
  date?: IDate;
  autoRedeem?: boolean;
  type?: Types;
  discount?: IDiscount;
  branches?: string[];
  terms?: string[];
  title?: string;
}

export interface IDocument extends ICreate {
  uuid: string;
  active?: boolean;
}

export interface IBrand {
  brand: string;
  models: IModel[];
}

export interface IModel {
  actual: string;
  display?: string;
}

export type IUpdate = Partial<Omit<IDocument, 'uuid' | 'active'>>;

export const Filter = {
  like: ['code', 'type', 'corporateUuid', 'title', 'description'],
  date: ['date.start', 'date.end'],
  boolean: ['autoRedeem', 'active'],
};

export interface IAccountData {
  docs: Auth.IAccount[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export type InstanceDocument = Record<
  'uuid' | 'code' | 'corporateUuid' | 'title',
  string
> &
  Record<'active' | 'autoRedeem', boolean> &
  Record<'type', Types> &
  Partial<
    Record<'description' | 'shortDescription', string> &
      Record<'terms', string[]>
  > &
  Record<'discount', IDiscount> &
  Record<'eligibility', IEligibility> &
  Record<'date', IDate> &
  Record<'branches', string[]>;
