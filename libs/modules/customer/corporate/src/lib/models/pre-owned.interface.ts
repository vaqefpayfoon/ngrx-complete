import { DownPaymentType } from './corporate.enum';
export interface IPreOwnedStreamUrls {
  version: string;
  url: IPreOwnedStreamUrlSet;
}
export interface IPreOwnedStreamUrlSet {
  listPreOwnedVehicles: string;
  getAvailableFilters: string;
  getVehicleDetails: string;
  getVehicleSpecification: string;
}
export enum PreOwnedStreamSource {
  PPSL = 'PPSL',
  SDAS = 'SDAS',
  SDASMY = 'SDASMY',
}
export interface IPreOwnedStream {
  integrationType: IIntegrationType;
  active: boolean;
}

export interface IIntegrationType {
  leaseGenius: ILeaseGenius;
  adtorque: IAdtorque;
}

export interface ILeaseGenius {
  active: boolean;
  apiKey: string;
  url: string;
}

export interface IAdtorque {
  active: boolean;
  username: string;
  password: string;
  source: PreOwnedStreamSource;
  urls: IPreOwnedStreamUrls[];
}

export interface IPreOwnedSales {
  active: boolean;
}

export interface IPreOwnedRegistrationDate {
  active: boolean;
}

export interface IPreOwnedFinance {
  active: boolean;
}

export interface IPreOwnedCheckpoint {
  active: boolean;
}

export interface IPreOwnedSoldVehicle {
  active: boolean;
  displayDays: number;
}

export interface IPreOwnedTestDrive {
  active: boolean;
  cancelAppointment: boolean;
  rescheduleAppointment: boolean;
}

export interface IPreOwnedFilterElements {
  title: string;
  max: number;
  min: number;
}

export interface IPreOwnedFilterPrice {
  active: boolean;
  increment: number;
  elements: IPreOwnedFilterElements[];
}

export interface IPreOwnedFilterAge {
  active: boolean;
  increment: number;
  elements: IPreOwnedFilterElements[];
}

export interface IPreOwnedFilterBodyType {
  active: boolean;
}

export interface IPreOwnedFilterVehicleMake {
  active: boolean;
}

export interface IPreOwnedFilterVehicleModel {
  active: boolean;
}

export interface IPreOwnedFilterSortBy {
  active: boolean;
}

export interface IPreOwnedFilter {
  active: boolean;
  price: IPreOwnedFilterPrice;
  age: IPreOwnedFilterAge;
  vehicleMake: IPreOwnedFilterVehicleMake;
  vehicleModel: IPreOwnedFilterVehicleModel;
  sortBy: IPreOwnedFilterSortBy;
  quickFilter: IPreOwnedQuickFilter;
}
export interface IPreOwnedQuickFilter {
  branch:IBranchFilter;
  active: boolean;
  monthlyInstallment: IMonthlyInstallment;
  bodyType: IPreOwnedFilterBodyType;
}
export interface IBranchFilter {
  active: boolean;
}
export interface IMonthlyInstallment {
  active: boolean;
  maxRange: number;
}
export interface IBankDowyPayment {
  type: DownPaymentType;
  amount: number;
}

export interface IBankPeriod {
  min: number;
  max: number;
}

export interface IPreOwnedBanks {
  name: string;
  uuid: string;
  logo: string;
  interestRate: number;
  isDefault: boolean;
  downPayment: IBankDowyPayment;
  period: IBankPeriod;
}

export interface IAppFeaturePreOwned {
  stream: IPreOwnedStream;
  testDrive: IPreOwnedTestDrive;
  sales: IPreOwnedSales;
  soldVehicle: IPreOwnedSoldVehicle;
  registrationDate: IPreOwnedRegistrationDate;
  finance: IPreOwnedFinance;
  checkpoint: IPreOwnedCheckpoint;
  filter: IPreOwnedFilter;
  banks: IPreOwnedBanks[];
}
