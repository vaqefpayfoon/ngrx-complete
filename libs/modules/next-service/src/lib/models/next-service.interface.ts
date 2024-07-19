export interface IDocument {
    account?: IAccount;
    accountVehicle?: IAccountVehicle;
    lastService?: Date;
    scheduled?: Date;
  }


  export interface IAccount {
    uuid: string;
    uid: string;
    email: string;
    account: IAccount;
    identity: IIdentity;
    phone: IPhone;
    active: boolean;
  }

  export interface IAccountVehicle {
    uuid: string;
    numberPlate: string;
    identificationNumber: string;
    warrantyPackages: string;
    registrationDate: Date;
    mileage: number;
    accountUuid: string;
    vehicleOwnerReference: string;
    carTyreSpecs?: ICarTyreSpecs;
    vehicleReference: IVehicleReference;
    nextService: INextService;
  }
  export interface IVehicleReference {
    unit?: IUnit;
    image?: string;
    uuid: string;
    type: string;
    availability: string;
  }
  export interface INextService {
    upcomingEngineOilService: string;
    estimatedEngineOilService: string;
  }
  export interface ICarTyreSpecs {
    front: {
      left: ISpecification;
      right: ISpecification;
    };
    rear: {
      left: ISpecification;
      right: ISpecification;
    };
  }
  export interface ISpecification {
    width: number;
    aspectRatio: number;
    rimSize: number;
  }
  export interface IAvailability {
    mobileService: boolean;
    serviceCenter: boolean;
  }
  export interface IUnit {
    brand: string;
    display: string;
    model: IModel;
    variant: IVariant;
  }
  export interface IModel {
    actual: string;
    display: string;
  }
  
  export interface IVariant {
    actual: string;
    display: string;
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
  export interface ITotal {
    uuid: string
    overall: IDashboard[];
    reservations: IData;
  }
  export interface IDashboard {
    monthName: string;
    total: number;
    unscheduled: number;
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

  export enum ScheduleType {
    UPCOMMING_UNSCHEDULED = 'UPCOMMING_UNSCHEDULED',
    UPCOMMING_SCHEDULED = 'UPCOMMING_SCHEDULED',
    MISSED_APPOINTMENT = 'MISSED_APPOINTMENT',
  }