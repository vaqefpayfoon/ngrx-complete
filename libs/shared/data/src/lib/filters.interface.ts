export interface IFilters {
  like?: Ilike;
  boolean?: IBoolean;
}

export interface Ilike {
  [key: string]: any;
}

export interface IBoolean {
  [key: string]: number;
}

export interface IFilter {
  [key: string]: any;
}
