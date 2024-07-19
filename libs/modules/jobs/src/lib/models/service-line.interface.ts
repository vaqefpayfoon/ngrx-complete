export interface IData {
    docs: IDocument[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  }
  export interface IDocument {
    uuid: string;
    corporateUuid: string;
    branchUuid: string;
    active: boolean;
    operationCode: string;
    service?: IService;
    eligibility?: IEligibility;
    isInCustomerApp: boolean;
    customizedDescription?: string;
  }
  export enum Config {
    LIMIT = 10,
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
  export interface IService {
    title: string;
    type: string;
    description: string;
    duration: number;
    price?: IPrice;
    date?: IDate;
    customizedDescription?: string;
  }
  export interface IEligibility {
    vehicles?: IVehicles;
    registrationYears?:string[];
    mileages?: IMileages[];
  }
  export interface IPrice {
    value: number;
    taxIncluded: boolean;
  }
  export interface IDate {
    start: Date;
    end: Date;
  }
  export interface IVehicles {
    brands: IBrand[];
  }
  export interface IBrand {
    brand: string;
    models: IModel[];
  }
  
  export interface IModel {
    actual: string;
    display?: string;
  }
  export interface IMileages {
    from: number;
    to: number;
  }
  export interface IServiceType {
    services: ServiceTypeItem[];
  }
  export interface ServiceTypeItem {
    type: string;
    name: string;
    description: string;
  }
  export enum BrandEligibilityTypes {
    ALL = 'All',
    BRAND = 'Filter by Brand',
  }
  export enum YearMakeEligibilityTypes {
    ALL = 'All',
    YEARMAKE = 'Filter by Year',
  }
  export enum MileageEligibilityTypes {
    ALL = 'All',
    MILEAGE = 'Filter by Mileage',
  }
  export interface IChangeStatus {
    uuid: string;
    active: boolean;
    isInCustomerApp: boolean;
  }