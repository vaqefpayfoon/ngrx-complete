export interface IResponse<T> {
  response: Response<T>;
}

interface Response<T> {
  message: string;
  data: {
    [propName: string]: T;
  };
}

export interface IError {
  status: number;
  message: string;
  data?: any
}

export interface IRequest<T> {
  payload: T;
}

export interface IBody<T, K = void> {
  changes: Partial<T> | K;
  document: T;
}
export interface IGlobalFilter {
  [propName: string]: any;
}

export interface IGlobalSort {
  [propName: string]: any;
}

export interface IGlobalConfig {
  page: number;
  limit: number;
}

export enum GlobalPaginationConfig {
  LIMIT = 10,
}

export interface IPagination {
  limit: number;
  page: number;
  pages: number;
}
export interface IGlobalPagination extends IPagination {
  total: number;
}

export interface IGlobalData<T> extends IGlobalPagination {
  docs: T[];
}

export function pointToString(pt: { x: number; y: number }) {
  return `(${pt.x}, ${pt.y})`;
}
