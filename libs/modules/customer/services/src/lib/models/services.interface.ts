export enum BODY_STYLES {
  LIGHT_WEIGHT = 'LIGHT_WEIGHT',
  MEDIUM_WEIGHT = 'MEDIUM_WEIGHT',
  HEAVY_WEIGHT = 'HEAVY_WEIGHT',
}

export enum RIM_SIZES {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export const RimStandardSizes = {
  Small: 17,
  Medium: 20,
};

export const AvailabilityCodes = {
  OK: 'OK',
  TYRE_SPEC_NOT_SET: 'TYRE_SPEC_NOT_SET',
};

export const BodyStylePricing = {
  CABRIOLET: BODY_STYLES.LIGHT_WEIGHT,
  COUPE: BODY_STYLES.LIGHT_WEIGHT,
  HATCHBACK: BODY_STYLES.LIGHT_WEIGHT,
  LIFTBACK: BODY_STYLES.MEDIUM_WEIGHT,
  GENERIC: BODY_STYLES.MEDIUM_WEIGHT,
  MPV: BODY_STYLES.MEDIUM_WEIGHT,
  PICKUP_TRUCK: BODY_STYLES.HEAVY_WEIGHT,
  SALOON: BODY_STYLES.HEAVY_WEIGHT,
  STATION_WAGON: BODY_STYLES.HEAVY_WEIGHT,
  SUV: BODY_STYLES.HEAVY_WEIGHT,
};

export const PricingTypes = {
  NORMAL: 'NORMAL',
  RIM_SIZE: 'RIM_SIZE',
  BODY_STYLE: 'BODY_STYLE',
};

export const Category = {
  PRODUCT: 'PRODUCT',
  LABOUR: 'LABOUR', // in future we remove rrp and only use fru
  REPAIR: 'REPAIR',
};

export const Configuration = {
  Type: {
    WARRANTY_SERVICE: 'WARRANTY_SERVICE',
    POST_WARRANTY_SERVICE: 'POST_WARRANTY_SERVICE',
    MOBILE_SERVICE: 'MOBILE_SERVICE',
    CAR_WASH: 'CAR_WASH',
    ALIGNMENT: 'ALIGNMENT',
    BATTERY: 'BATTERY',
    BRAKE_PAD: 'BRAKE_PAD',
    BRAKE_DISC: 'BRAKE_DISC',
    TYRE: 'TYRE',
    BALANCING: 'BALANCING',
    COMPLAINT: 'COMPLAINT',
  },

  Category: {
    WARRANTY_SERVICE: Category.LABOUR,
    POST_WARRANTY_SERVICE: Category.LABOUR,
    MOBILE_SERVICE: Category.LABOUR,
    CAR_WASH: Category.LABOUR,
    ALIGNMENT: Category.LABOUR,
    BATTERY: Category.PRODUCT,
    BRAKE_PAD: Category.PRODUCT,
    BRAKE_DISC: Category.PRODUCT,
    TYRE: Category.PRODUCT,
    BALANCING: Category.LABOUR,
    COMPLAINT: Category.REPAIR,
  },
  IsMainService: {
    WARRANTY_SERVICE: true as boolean,
    POST_WARRANTY_SERVICE: true as boolean,
    CAR_WASH: true as boolean,
    ALIGNMENT: true as boolean,
    BATTERY: true as boolean,
    BRAKE_PAD: true as boolean,
    BRAKE_DISC: true as boolean,
    TYRE: true as boolean,
    BALANCING: true as boolean,
    MOBILE_SERVICE: false as boolean,
    COMPLAINT: true as boolean,
  },
  AllowedQuantity: {
    WARRANTY_SERVICE: 1,
    POST_WARRANTY_SERVICE: 1,
    MOBILE_SERVICE: 1,
    CAR_WASH: 1,
    ALIGNMENT: 1,
    BATTERY: 1,
    BRAKE_PAD: 1,
    BRAKE_DISC: 1,
    COMPLAINT: 1,
    BALANCING: 4,
    TYRE: 4,
  },
  DefaultQuantity: {
    WARRANTY_SERVICE: 1,
    POST_WARRANTY_SERVICE: 1,
    MOBILE_SERVICE: 1,
    CAR_WASH: 1,
    ALIGNMENT: 1,
    COMPLAINT: 1,
    BATTERY: 1,
    BRAKE_PAD: 1,
    BRAKE_DISC: 1,
    BALANCING: 4,
    TYRE: 1,
  },
  Mapping: {
    BATTERY: { match: 'battery', field: 'partNumbers' },
    BRAKE_PAD: { match: 'brakePad', field: 'partNumbers' },
    BRAKE_DISC: {
      match: 'brakeDisc',
      field: 'partNumbers',
    },
    TYRE: { match: 'tyre', field: 'partNumbers' },
  },
};


export const ServiceCenterTypes = {
  NONE: 'NONE',
  FAST_LANE: 'FAST_LANE',
  REPAIR: 'REPAIR',
};

export interface ICreate {
  corporateUuid: string;
  branchUuid: string;
  appointment: IAppointment;
  title: string;
  subtitle?: string;
  description: string;
  type: string;
  pricing: IPricing;
  flatRateUnit: number;
  tax: number;
}

export interface IUpdate {
  uuid?: string;
  type?: string;
  title?: string;
  appointment?: IAppointment;
  subtitle?: string;
  description?: string;
  pricing?: IPricing;
  flatRateUnit?: number;
  tax?: number;
}

export interface IAppointment {
  mobileService: string;
  serviceCenter: string;
}

export interface IDocument extends ICreate {
  uuid: string;
  icon: string;
  serviceType: string;
  category: string;
  specifications: ISpecification[];
  isActive: boolean;
  isMainService: boolean;
  allowedQuantity: number;
}

export interface IPricing {
  type: string;
  unitBuyingPrice: INormalPrice | IRimSizePrice | IBodyStylePrice;
  recommendedRetailPrice: INormalPrice | IRimSizePrice | IBodyStylePrice;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface INormalPrice {
  NORMAL: number;
}

export interface IRimSizePrice {
  SMALL: number;
  MEDIUM: number;
  LARGE: number;
}

export interface IBodyStylePrice {
  LIGHT_WEIGHT: number;
  MEDIUM_WEIGHT: number;
  HEAVY_WEIGHT: number;
}
