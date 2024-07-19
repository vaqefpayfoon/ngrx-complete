export interface IDocument {
  uuid: string;
  name: string;
  isSuperAdminRole: boolean;
  isVisible: boolean;
  permissions: string[];
}

export interface IUpdate {
  permissions: string[];
  isSuperAdminRole?: boolean;
  isVisible?: boolean;
}
