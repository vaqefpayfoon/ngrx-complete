export enum IndicatorTypes {
  BAR = 'BAR',
  LINE = 'LINE',
  HEADER = 'HEADER',
  TREEMAP = 'TREEMAP',
  INDICATOR = 'INDICATOR',
  PIE = 'PIE',
  RATE = 'RATE'
}

export interface IChart {
  chartType: string | IndicatorTypes;
  description: string;
  items: IItem[];
  title: string;
  width: number;
}

export interface IItem {
  key: string;
  value: any;
}

// export type ValueUnion = IValueElement[] | number | string;

export interface IValueElement {
  key: Date;
  value: number;
}

export interface IReport {
  aggregateBy: string;
  corporateUUID: string;
  scope: string;
  scopeEnd: any;
  scopeStart: any;
}

export interface IBasic {
  charts: IChart[];
  report: IReport;
}
