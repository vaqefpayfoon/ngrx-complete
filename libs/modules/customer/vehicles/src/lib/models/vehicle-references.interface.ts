export enum CarBodyStyle {
  CABRIOLET = 'CABRIOLET',
  COUPE = 'COUPE',
  HATCHBACK = 'HATCHBACK',
  LIFTBACK = 'LIFTBACK',
  MPV = 'MPV',
  PICKUP_TRUCK = 'PICKUP TRUCK',
  SALOON = 'SALOON',
  STATION_WAGON = 'STATION WAGON',
  SUV = 'SUV',
}

export enum BikeBodyStyle {
  NAKED = 'NAKED',
  CRUISER = 'CRUISER',
  UNDERBONE = 'UNDERBONE',
  DUAL_SPORT = 'DUAL SPORT',
  SCOOTER = 'SCOOTER',
}

export enum VehicleType {
  CAR_PETROL = 'CAR_PETROL',
  CAR_DIESEL = 'CAR_DIESEL',
  CAR_ELECTRIC = 'CAR_ELECTRIC',
  CAR_HYBRID = 'CAR_HYBRID',
  CAR_UNKNOWN = 'CAR_UNKNOWN',
  VAN_PETROL = 'VAN_PETROL',
  VAN_DIESEL = 'VAN_DIESEL',
  VAN_ELECTRIC = 'VAN_ELECTRIC',
  VAN_HYBRID = 'VAN_HYBRID',
  VAN_UNKNOWN = 'VAN_UNKNOWN',
  BIKE_PETROL = 'BIKE_PETROL',
  BIKE_DIESEL = 'BIKE_DIESEL',
  BIKE_ELECTRIC = 'BIKE_ELECTRIC',
  BIKE_HYBRID = 'BIKE_HYBRID',
  BIKE_UNKNOWN = 'BIKE_UNKNOWN',
}

export enum EngineType {
  TWO_STROKE = 'TWO_STROKE',
  FOUR_STROKE = 'FOUR_STROKE',
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

export class ICreate {
  unit: IUnit;
  production?: IProduction;
  engine?: IEngine;
  corporateUuid: string;
  type: VehicleType;
  availability?: IAvailability;
  serviceMap?: IServiceMap;
}

export class IDocument extends ICreate {
  uuid: string;
  active: boolean;
}

export class IUpdate {
  unit?: IUnit;
  production?: IProduction;
  engine?: IEngine;
  type?: string;
  availability?: IAvailability;
  serviceMap?: IServiceMap;
}

export class IAvailability {
  mobileService?: boolean;
  serviceCenter?: boolean;
}

export interface IServiceMap {
  battery?: IBattery;
  brakePad?: IBrakePad;
  brakeDisc?: IBrakePadPartNumbers;
  tyre?: ITyre;
  engineOil: IEngineOil;
}

export interface IBattery {
  partNumbers: string[];
}

export interface IBrakePad {
  partNumbers: IBrakePadPartNumbers;
}

export interface IBrakePadPartNumbers {
  frontAxle: string[];
  rearAxle: string[];
}

export interface ITyre {
  partNumbers: ITyrePartNumbers;
}

export interface ITyrePartNumbers {
  frontAxle: string[];
  rearAxle: string[];
}

export interface IEngineOil {
  MinimumRequirement: number;
  partNumbers: IEngineOilPartNumbers;
}

export interface IEngineOilPartNumbers {
  filter: string[];
}

export class IEngine {
  capacity: number;
}

export class IProduction {
  start: number;
  end?: number;
}

export interface IUnit {
  brand: string;
  model: IModel;
  variant: IVariant;
  bodyStyle?: CarBodyStyle | BikeBodyStyle;
}

export interface IModel {
  actual: string;
  display: string;
}

export interface IVariant {
  actual: string;
  display: string;
}

export interface IVariants {
  uuid: string;
  variant: string;
}
