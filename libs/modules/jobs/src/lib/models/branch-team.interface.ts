export interface IDocument {
  operation: IOperation[];
  fleet: IFleet[];
}

export interface IOperation {
  fullname: string;
  uuid: string;
}

export interface IFleet {
  name: string;
  uuid: string;
}
