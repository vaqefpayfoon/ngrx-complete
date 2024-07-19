export enum InsurerType {
  WEB = 'WEB',
  FORM = 'FORM',
}

export interface ICreate {
  name: string;
  corporateUuid: string;
  url: string;
  image: string;
  type?: InsurerType;
}

export type IUpdate = Partial<Omit<ICreate, 'corporateUuid'>> &
  Partial<Record<'active', boolean>>;

export interface IDocument extends ICreate {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export const Filter = {
  like: ['active', 'corporateUuid', 'active', 'name'],
  date: [],
};
export const Sort = Filter.like;
