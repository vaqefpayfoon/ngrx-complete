import { IDate, IEligibility } from "./service-line.interface";

export interface IData {
    docs: IDocument[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  }
  export interface IDocument {
    uuid: string;
    corporateUuid: string;
    branchUuid: string;
    active: boolean;
    isInCustomerApp?: boolean;
    package?: IPackage;
    eligibility?: IEligibility;
    serviceLineUuids: string[];
    duration: number;

  }
  export interface IPackage {
    title?: string;
    price?: IPrice;
    description: string;
    isManufactureRecommended: boolean;
    isLimitedTimeSpecials: boolean;
    date: IDate;
  }
  
  export interface IPrice {
    value: number;
    taxIncluded: boolean;
  }
