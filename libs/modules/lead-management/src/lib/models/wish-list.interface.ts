export interface IDocument {
  uuid: string;
  type: string;
  createdAt: string;
  modelUuid: string;
  vehicle: WishListVehicle;
}
export interface IData {
  uuid?: string;
  wishLists: IDocument[];
}
export interface WishListVehicle {
  unit: WishListUnit;
  price: number;
  monthlyPayment: number;
  stock: number;
  image: string;
  registrationDate: string;
  mileage: string;
  isHotDeal: boolean;
  isSold: boolean;
}
export interface WishListUnit {
  brand: string;
  model: string;
  actualModel: string;
  display: string;
  variant: string;
  actualVariant: string;
  series: string;
}
