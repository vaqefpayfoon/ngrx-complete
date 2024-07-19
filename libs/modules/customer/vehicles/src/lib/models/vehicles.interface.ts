export enum VehicleVariantType {
  CAR_PETROL = 'CAR_PETROL',
  CAR_DIESEL = 'CAR_DIESEL',
  CAR_ELECTRIC = 'CAR_ELECTRIC',
  CAR_HYBRID = 'CAR_HYBRID',
  CAR_UNKNOWN = 'CAR_UNKNOWN',
  BIKE_PETROL = 'BIKE_PETROL',
  BIKE_DIESEL = 'BIKE_DIESEL',
  BIKE_ELECTRIC = 'BIKE_ELECTRIC',
  BIKE_HYBRID = 'BIKE_HYBRID',
  BIKE_UNKNOWN = 'BIKE_UNKNOWN',
}

export enum FleetType {
  CAR = 'CAR',
  BIKE = 'BIKE',
}

export enum FuelType {
  GASOLINE = 'GASOLINE',
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
}

export enum OwnerType {
  PRIVATE = 'PRIVATE',
  BUSINESS = 'BUSINESS',
}

export enum CheckupStatus {
  NONE = 'NONE',
  OK = 'OK',
  CAUTIOUS = 'CAUTIOUS',
  DANGEROUS = 'DANGEROUS',
}

export enum EngineType {
  TWO_STROKE = 'TWO_STROKE',
  FOUR_STROKE = 'FOUR_STROKE',
}

export const BodyStyleCategory = {
  NONE: 'NONE',
  LIGHT_WEIGHT: 'LIGHT_WEIGHT',
  HEAVY_WEIGHT: 'HEAVY_WEIGHT',
};

export enum VehicleType {
  SEARCH = 'SEARCH',
  ITEM = 'ITEM',
  ALL = 'ALL',
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
  filter?: IFilter;
  sort?: ISort;
  page: number;
  limit: number;
}

export interface IFilter {
  [key: string]: string;
}

export interface ISort {
  [sort: string]: number;
}

export interface ICreate {
  vehicleReferenceUuid: string;
  ownerType: string;
  numberPlate: string;
  identificationNumber?: string;
  fuelType?: string;
  carTyreSpecs?: ICarTyreSpecs;
  bikeTyreSpecs?: IBikeTyreSpecs;
}

export interface IUpdate extends ICreate {
  uuid: string;
}

export interface IDocument extends ICreate {
  uuid: string;
  account: IAccount;
  accountUuid: string;
  tyreSpecs?: ICarTyreSpecs | IBikeTyreSpecs;
  vehicleReference: IVehicleReference;
  warrantyPackages?: IWarrantyPackage[];
  active?: boolean;
  inspections?: IInspection[];
  pagination?: IPagination;
}

export interface IAccount {
  email?: string;
  phone?: IPhone;
  name?: Name;
  identity?: IIdentity;
  document?: IDocumentType;
}

export interface IDocumentType {
  type: string;
  id: string;
}

export interface IIdentity {
  salutation?: string;
  fullName: string;
}

export interface Name {
  first: string;
  last: string;
}

export interface IPhone {
  code: string;
  number: string;
}

export interface IUnit {
  brand: string;
  display?: string;
  model: IModel;
  variant: IVariant;
  bodyStyle: string;
}

export interface IModel {
  actual: string;
  display: string;
}

export interface IVariant {
  actual: string;
  display: string;
}

export interface ISpecification {
  width: number;
  aspectRatio: number;
  rimSize: number;
}

export interface IWarrantyPackage {
  packageName: string;
  dateRange: IDateRange;
  duration: number;
  mileage: number;
}

export interface IDateRange {
  startDate: string;
  endDate: string;
}

export interface ITyre {
  widths: string[];
  aspectRatios?: string[];
  rims?: string[];
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

export interface IBikeTyreSpecs {
  front: ISpecification;
  rear: ISpecification;
}

export interface IVehicleReference {
  unit?: IUnit;
  type: string;
}

export interface IVariants {
  uuid: string;
  variant: string;
}

export interface IDataInspections {
  docs: IInspection[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IInspection {
  uuid: string;
  reservationUuid: string;
  operationUuid: string;
  accountVehicleUuid: string;
  accountUuid: string;
  vehicleType: string;
  categories: ICategory[];
  comment: string;
  inspectedAt: ISphere;
  isActive: boolean;
}

export interface ICategory {
  key: string;
  title: string;
  checkups: ICheckup[];
}

export interface ICheckup {
  key: string;
  value: any;
  title: string;
  report: any | CheckupStatus;
  status: string;
  sphere?: ISphere;
}

export interface ISphere {
  region: string;
  iso: string;
  timestamp: string;
  formattedMoment: string;
}

export interface  IGlobalVehicle{
  brands?: string[];
  models?: string[];
  variants?: string[];
}
