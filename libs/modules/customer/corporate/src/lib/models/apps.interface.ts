export enum AppTypes {
  IONIC = 'Ionic',
  SALESFORCE = 'Salesforce',
  RONIC = 'Ronic',
  INSTAVID360 = 'InstaVid360',
}

export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum Config {
  LIMIT = 100,
}

export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IConfig {
  corporateUuid: string;
}

export interface ICreate {
  corporateUuid: string;
  name: string;
  type: string;
  payload: IIonicPayload | ISalesforcePayload; // todo do not use union type here
}

export interface IDocument extends ICreate {
  uuid: string;
  active: boolean;
}

export interface ICreateResponse {
  appKey: string;
  corporateApp: IDocument;
}

export interface IUpdate {
  name?: string;
  payload?: object; // todo validate type
}

export interface IIonicPayload {
  iosBundleId: string;
  androidPackageName: string;
}

export interface ISalesforcePayload {
  apiKey: string;
  apiSecret: string;
}

export interface IToken {
  token: string;
  corporateApp: IDocument;
}
