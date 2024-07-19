export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum Config {
  LIMIT = 10
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
  partNumber: string;
  productReferenceUuid: string;
  branchUuid: string;
  pricing: IPricing;
}

export interface IUpdate {
  uuid?: string;
  partNumber: string;
  pricing: IPricing;
}

export interface IDocument {
  uuid: string;
  active: boolean;
  branchUuid: string;
  serviceUuid: string;
  productReferenceUuid: string;
  productReference: IProductReference;
  partNumber: string;
  pricing?: IPricing;
}

export interface IProductReference {
  unit: IUnit;
  serviceType: string;
  branchUuid: string;
  uuid: string
}

export interface IUnit {
  brand: string;
  model: string;
  display: string;
  specification: ISpecification[];
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface IPricing {
  recommendedRetailPrice: string;
  unitBuyingPrice?: string;
}

export interface IModel {
  model: string;
  uuid: string;
}

export interface IProductDocument {
  description: string;
  image: string;
  unit: IUnit;
  serviceUuid: string;
  uuid: string;
  active: boolean;
}
