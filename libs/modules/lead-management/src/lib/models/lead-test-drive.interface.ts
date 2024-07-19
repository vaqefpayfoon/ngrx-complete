export interface IDocument {
    uuid: string;
    createdAt: string;
    status: string;
    type: string;
    location: Location;
    salesAdvisor: SalesAdvisor;
    unit: Unit;
  }
  export interface IData {
    uuid?: string;
    testDrives: IDocument[];
  }
  export interface Location {
    country: string;
    state: string;
    address: string;
    latitude: string;
    longitude: string;
  }
  export interface SalesAdvisor {
    name: string;
    email: string;
    phone: Phone;
  }
  export interface Phone {
    phoneNumber?: string;
    code?: string;
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
  