export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum ServiceTypes {
  TYRE = 'TYRE',
  BATTERY = 'BATTERY',
  BRAKE_PAD = 'BRAKE_PAD',
  BRAKE_DISC = 'BRAKE_DISC',
}

export enum Config {
  LIMIT = 10
}

export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IConfig {
  page: number;
  limit: number;
}

export interface ICreate {
  description: string;
  unit: IUnit;
  image: any;
  serviceType: ServiceTypes;
}

export interface IUpdate {
  description?: string;
  image?: string;
  unit?: IUnit;
}

export interface IDocument extends ICreate {
  uuid: string;
  active: boolean;
}

export interface IUnit {
  brand: string;
  model: string;
  specification: ISpecification[];
}

export interface ISpecification {
  key: string;
  value: string;
}

export const Specification = {
  TYRE: {
    WIDTH: 'Width' as string,
    RIM_SIZE: 'Rim Size' as string,
    ASPECT_RATIO: 'Aspect Ratio' as string,
    LOAD_INDEX: 'Load Index' as string,
    SPEED_RATING: 'Speed Rating' as string
  },
  BATTERY: { AMPERE_HOUR: 'Ampere Hour' as string },
  BRAKE_PAD: { AXLE: 'Axle' as string },
  BRAKE_DISC: { AXLE: 'Axle' as string },
};
