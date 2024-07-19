export const SpecKeys = {
  WHEELS: 'WHEELS',
  SEATING_FABRICS: 'SEATING_FABRICS',
  ENGINE_CAPACITY: 'ENGINE_CAPACITY',
  TRANSMISSION_TYPE: 'TRANSMISSION_TYPE',
  FUEL_CONSUMPTION: 'FUEL_CONSUMPTION',
  FUEL_TYPE: 'FUEL_TYPE',
  MAX_TORQUE: 'MAX_TORQUE',
  MAX_OUTPUT: 'MAX_OUTPUT',
  CO2_EMISSION: 'CO2_EMISSION',
  ENGINE_MODEL: 'ENGINE_MODEL',
  DRIVE_CONFIGURATION: 'DRIVE_CONFIGURATION',
  WHEEL_BASE: 'WHEEL_BASE',
  FRONT_AXLE: 'FRONT_AXLE',
  REAR_AXLE: 'REAR_AXLE',
  GROSS_COMBINATION_WEIGHT: 'GROSS_COMBINATION_WEIGHT',
  MAX_GROSS_VEHICLE_WEIGHT: 'MAX_GROSS_VEHICLE_WEIGHT',
  FUEL_TANK: 'FUEL_TANK',
  ENGINE_TOTAL_DISPLACEMENT: 'ENGINE_TOTAL_DISPLACEMENT',
  TRANSISSION_MODEL: 'TRANSISSION_MODEL',
  TYRE_SIZE: 'TYRE_SIZE',
};

// todo: import it from vehicle reference
export enum VehicleType {
  CAR_PETROL = 'CAR_PETROL',
  CAR_DIESEL = 'CAR_DIESEL',
  CAR_ELECTRIC = 'CAR_ELECTRIC',
  CAR_HYBRID = 'CAR_HYBRID',
  BIKE_PETROL = 'BIKE_PETROL',
  BIKE_DIESEL = 'BIKE_DIESEL',
  BIKE_ELECTRIC = 'BIKE_ELECTRIC',
  BIKE_HYBRID = 'BIKE_HYBRID',
  TRUCK_DIESEL = 'TRUCK_DIESEL',
  TRUCK_ELECTRIC = 'TRUCK_ELECTRIC',
  TRUCK_PETROL = 'TRUCK_PETROL',
  TRUCK_HYBRID = 'TRUCK_HYBRID',
  VAN_DIESEL = 'VAN_DIESEL',
  VAN_ELECTRIC = 'VAN_ELECTRIC',
  VAN_PETROL = 'VAN_PETROL',
  VAN_HYBRID = 'VAN_HYBRID',
}

export const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export enum DepositTypes {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
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
  page: number;
  limit: number;
}

export interface IDisplayAdditionalInformation {
  pricesExcludingCoe: boolean;
}

export interface IDocument extends ICreate {
  uuid: string;
  branches: IBranch[];
  type: string;
  image?: string;
  gallery?: IGallery;
  active: boolean;
}

export interface ISetModelImage extends IDocument, IVariant {}

export interface IFile extends IDocument {
  file: any;
}

export interface ICreate {
  corporateUuid: string;
  unit: IUnit;
  type: string;
  price: number;
  order?: number;
  specs: ISpecs[];
  // loan?: ILoan;
  loanLink?: string;
  sales?: ISales;
  promotion?: IPromotion;
  brochures?: IBrochure[];
  displayAdditionalInformation?: IDisplayAdditionalInformation;
}

export interface IUpdate {
  specs?: ISpecs[];
  brochures?: IBrochure[];
  // loan?: ILoan;
  loanLink?: string;
  order?: number;
  price?: number;
  type?: string;
  unit?: IUnit;
  image?: string;
  gallery?: IGallery;
  sales?: ISales;
  promotion?: IPromotion;
}

export interface ISales {
  deposit: ISalesDeposit;
  active: boolean;
}

export class ISalesDeposit {
  type: string | DepositTypes;
  amount: number;
}

export interface IPromotion {
  image: string;
  title: string;
  description: string;
  discount: ISalesDeposit;
}

export interface IBranchSales {
  active: boolean;
}

export interface IBranch {
  uuid: string;
  testDrive: IBranchTestDrive;
  sales: IBranchSales;
}

export interface IBranchTestDrive {
  location: IBranchTestDriveLocation;
  showRoom: IBranchTestDriveLocation;
  active: boolean;
}

export interface IBranchTestDriveLocation {
  days: ITestDriveDate;
  active: boolean;
  lock?: boolean;
}

export interface ITestDriveDate {
  monday?: ITestDriveDay;
  tuesday?: ITestDriveDay;
  wednesday?: ITestDriveDay;
  thursday?: ITestDriveDay;
  friday?: ITestDriveDay;
  saturday?: ITestDriveDay;
  sunday?: ITestDriveDay;
}

export interface ITestDriveDay {
  start: string; // ISO
  end: string;
  session: number;
}

export interface IUnit {
  brand: string;
  model: string;
  display: string;
  variant: string;
  actualVariant: string;
  actualModel: string;
  series: string;
}

export interface ISpecs {
  key: string;
  value: string;
}

// export interface ILoan {
//   minDownPayment?: number;
//   period: IRangeNumber;
//   interestRate: number;
// }

export interface IRangeNumber {
  min: number;
  max: number;
}

export interface IGallery {
  interior?: IGalleryDetail[];
  exterior: IGalleryDetail[];
}

export interface IGalleryDetail {
  color: IGalleryColor;
  images: string[];
}

export interface IGalleryColor {
  name: string;
  image: string;
}

export interface ISetBranches {
  corporateUuid: string;
  branches?: IBranch[];
  brand: string;
  series: string;
  model?: string;
  variant?: string;
}

export interface ISetSeriesImage {
  corporateUuid: string;
  brand: string;
  series: string;
  image: any;
}

export interface ISetModelImage {
  corporateUuid: string;
  brand: string;
  model: string;
  image: string;
}

export interface IBrochure {
  name: string;
  link: string;
}

export interface IListBrandsAndSeries {
  brands: IBrand[];
}

export interface IBrand {
  series: ISeries[];
  logo: string;
  name: string;
}

export interface ISeries {
  models?: IModel[];
  name: string;
  image: string;
  currency?: string;
}

export interface IListSeriesModels {
  series: ISeries;
}

export interface IModel {
  uuid?: string;
  name: string;
  display?: string;
  actualModel?: string;
  image: string;
}

export interface IUnitList {
  brandsAndSeries: IBrand[];
  models?: IModel[];
  variants?: IDocument[];
}

export interface IVariant {
  corporateUuid?: string;
  brand: string;
  series?: string;
  model?: string;
  actualModel?: string;
}

export interface IVariants {
  name: string;
  images: any[];
}
