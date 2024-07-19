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
  branchUuid: string;
  name: string;
  numberPlate: string;
}

export interface IDocument extends ICreate {
  uuid: string;
  active: boolean;
}

export interface IUpdate {
  branchUuid?: string;
  name?: string;
  numberPlate?: string;
}
