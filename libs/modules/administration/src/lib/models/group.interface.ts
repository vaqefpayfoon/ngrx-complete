export interface IDocument {
  uuid: string;
  name: string;
  roleUuids: string[];
}

export interface ICreate {
  name: string;
  roleUuids: string[];
  corporateUuid: string;
}

export interface IUpdate {
  roleUuids: string[];
}

export interface IRole {
  uuid: string;
  name?: string;
}

export interface IGetGroup {
  uuid: string;
  name: string;
}
