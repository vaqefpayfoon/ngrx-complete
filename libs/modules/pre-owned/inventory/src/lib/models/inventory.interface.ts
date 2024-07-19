export interface ICreate {
  uuid: string;
  file: File;
}

export interface IData {
  url: string;
}

export interface IDocument {
  updatedAt: string;
  account: string;
  success: number;
  failed: number;
  download: string;
  status: string;
}

export interface IInventory {
  corporateUuid: string;
  createdAt: string;
  error_message: string;
  filePath: string;
  filePathResult: string;
  status: string;
  updatedAt: string;
  uuid: string;
  downloadPath: string;
  result?: IResult[],
  summery?: ISummery[]
}
export interface IResult {
  status: string,
  stockNo: string,
  errors: string[]
}
export interface ISummery {
  key: string;
  value: string;
}