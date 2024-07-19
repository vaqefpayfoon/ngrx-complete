export enum Types {
  RSVP = 'RSVP',
  APP_SCREEN = 'APP_SCREEN',
  NEWSLETTER = 'NEWSLETTER',
  BANK_PROMOTION = 'BANK_PROMOTION',
}

export enum ContentType {
  HTML = 'HTML',
  PDF = 'PDF',
}

export enum ContentPDFType {
  UPLOAD = 'UPLOAD',
  LINK = 'LINK',
}

export enum Screens {
  TEST_DRIVE = 'TEST_DRIVE',
}

export interface ITestDriveBrand {
  name: string;
  logo: string;
}

export interface TestDrivePayload {
  brand: ITestDriveBrand;
  model: string;
  series: string;
  uuid: string;
}

export class ScreenPayloadSchemas {
  TEST_DRIVE: TestDrivePayload;
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
  name?: string;
  active?: boolean;
  _id?: number;
  createdAt?: number;
}

export interface IDocument extends ICreate {
  uuid: string;
  active: boolean;
  image: any;
  applicationRate?: string;
  viewRate?: string;
}

export interface ICreate {
  corporateUuid: string;
  name: string;
  description?: string;
  date: IDate;
  type: Types | string;
  data: IPayload;
  content: IContent;
  targetUuid?: string;
  isPrivate: boolean;
  isFeatured: boolean; // validate there are only 5 active isFeatured campaigns
  notification?: INotification;
  file?: any;
  image: any;
}

export interface IPayload extends IRsvpData, IAppScreenData, INewsletterData {}

export interface IUpdate {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  content?: IContent;
  data?: IPayload;
  date?: IDate;
  type?: string;
  file?: any;
  isFeatured?: boolean;
  image?: string;
}

export interface IDate {
  start: Date;
  end: Date;
}

export interface IContent {
  type: string | ContentType;
  body?: string;
}

export interface IRsvpData {
  selectedDates: IRsvpSelectedDate[];
  location: ILocation;
}

export interface INewsletterData {
  link: string;
}

export interface IAppScreenData {
  screen: string;
  payload: Object | any | TestDrivePayload;
}

export interface INotification {
  title: string;
  body: string;
}

export interface IRsvpSelectedDate {
  start: Date; // validate it is >= campaign.date.start
  end: Date; // validate it is <= campaign.date.end && end > start
  // validate start and end are on same day
  availableSeats: number;
  maxPax: number;
}

export interface ILocation {
  address: string;
  latitude: string;
  longitude: string;
}
