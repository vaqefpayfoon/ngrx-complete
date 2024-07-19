export interface IData {
  remainingBrands: string[];
  brandsFlatRateUnit: IDocument[];
}

export interface IDocument {
  brand: string;
  hourlyFee: number;
  unitsPerHour: number;
}

export interface ISetBrandsFru {
  flatRateUnits: IDocument[];
  branchUuid: string;
  corporateUuid: string;
}

export interface IGetBrandsFru {
  corporateUuid: string;
  branchUuid: string;
}
