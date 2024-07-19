export interface IDocument {
  uuid: string;
  status: string;
  branch: Branch;
  model: Model;
  shared: Shared;
  createdAt: string;
}
export interface IData {
  uuid?: string;
  purchaseQuotes: IDocument[];
}
export interface Branch {
  uuid?: string;
  name?: string;
}
export interface Shared {
  uuid?: string;
  dateAndTime?: string;
  fullName: string;
}
export interface Model {
  uuid?: string;
  price: number;
  type: string;
  unit: Unit;
}
export interface Unit {
  brand: string;
  model: string;
  actualModel: string;
  display: string;
  variant: string;
  actualVariant: string;
  series: string;
}
