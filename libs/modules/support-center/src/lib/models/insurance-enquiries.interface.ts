import { Auth } from '@neural/auth';
import { IAccount as IAccountModel } from '@neural/modules/administration';

export enum Status {
  CLOSED = 'CLOSED',
  CHECKED = 'CHECKED',
  NEW = 'NEW',
}

export class IAccount {
  uuid: string;
  identity: Auth.IIdentity;
  image?: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface IDocument {
  uuid: string;
  numberPlate: string;
  corporateUuid: string;
  account: IAccount;
  document: IAccountModel.IDocumentType;
  postCode: string;
  adminRemark?: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  insurerName?: string;
  ncdEntitlement: string;
  referenceNumber?: string;
  status?: Status;
}

export type IUpdate = Pick<IDocument, 'status' | 'adminRemark'>;

export const Filter = {
  like: ['numberPlate', 'document.type', 'document.id', 'postCode'],
  date: [],
};
export const Sort = Filter.like;
