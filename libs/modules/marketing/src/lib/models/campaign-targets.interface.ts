export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum Config {
  LIMIT = 100
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
  [key: string]: string;
}

export interface IDocument {
  uuid: string;
  corporateUuid: string;
  name: string;
  accountUuids: string[];
}
