export interface ISendMessageNotification {
  title: string;
  body: string;
}

export interface ISendMessage {
  inboxMessageUuid: string;
  accountUuids?: string[];
  notification: ISendMessageNotification;
  target: string;
  identificationNumbers?: string[];
}

export enum Target {
  ALL = 'ALL',
  SELECTIVE = 'SELECTIVE',
  ADMIN = 'ADMIN',
  OPERATION = 'OPERATION',
}

export enum TargetTypes {
  AccountId = "Filter By Customer's Account",
  FilterByVin = "Filter By Customer's Vehicle",
}