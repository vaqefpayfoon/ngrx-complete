// TODO: Create models inside UI for interfaces
export interface IData {
  html?: string;
  tag?: ITags;
  images?: string[];
  name?: string; // temporary member. To be removed.
}

export enum Master {
  MASTER = 'MASTER'
}

export interface ITags {
  [name: string]: ITag[];
}

export interface ITag {
  key: string;
  value: string;
}
