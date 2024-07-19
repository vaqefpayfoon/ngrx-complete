export enum Products {
  NERV_STAGING = 'io.whipmobility.nerv',
  NERV_CLIENT = 'io.whipmobility.nerv-client',
  NERV_CUSTOMER = 'io.whipmobility.nerv-customer',
  NERV_PRODUCTION = 'com.whipmobility.nerv',
  NERV_SANDBOX = 'cloud.whipmobility.nerv',

  WM_OPERATION_ANDROID_CLIENT = 'com.whipmobility.android.serviceadvisor.development',
  WM_OPERATION_ANDROID_STAGING = 'com.whipmobility.android.operation.staging',
  WM_OPERATION_ANDROID_SANDBOX = 'com.whipmobility.android.operation',
  WM_OPERATION_ANDROID_PRODUCTION = 'com.whipmobility.android.operation',
  WM_OPERATION_IOS_CLIENT = 'com.whipmobility.ios.serviceadvisor.development',
  WM_OPERATION_IOS_STAGING = 'com.whipmobility.ios.operation.staging',
  WM_OPERATION_IOS_SANDBOX = 'com.whipmobility.ios.operation',
  WM_OPERATION_IOS_PRODUCTION = 'com.whipmobility.ios.operation',
  WM_SERVICE_ADVISOR_WEB_STAGING = 'com.whipmobility.web.serviceadvisor.staging',
  WM_SALES_ADVISOR_WEB_STAGING = 'com.whipmobility.web.salesadvisor.staging',
  WM_SERVICE_ADVISOR_ANDROID_STAGING = 'com.whipmobility.android.serviceadvisor.staging',
  WM_SERVICE_ADVISOR_IOS_STAGING = 'com.whipmobility.ios.serviceadvisor.staging',
  WM_SALES_ADVISOR_ANDROID_STAGING = 'com.whipmobility.android.salesadvisor.staging',
  WM_SALES_ADVISOR_IOS_STAGING = 'com.whipmobility.ios.salesadvisor.staging',
  WM_SERVICE_ADVISOR_ANDROID_SANDBOX = 'com.whipmobility.android.serviceadvisor.sandbox',
  WM_SERVICE_ADVISOR_IOS_SANDBOX = 'com.whipmobility.ios.serviceadvisor.sandbox',
  WM_SALES_ADVISOR_ANDROID_SANDBOX = 'com.whipmobility.android.salesadvisor.sandbox',
  WM_SALES_ADVISOR_IOS_SANDBOX = 'com.whipmobility.ios.salesadvisor.sandbox',
  WM_SALES_ADVISOR_ANDROID_PRODUCTION = 'com.whipmobility.android.salesadvisor',
  WM_SALES_ADVISOR_IOS_PRODUCTION = 'com.whipmobility.ios.salesadvisor',
  WM_SERVICE_ADVISOR_ANDROID_PRODUCTION = 'com.whipmobility.android.serviceadvisor',
  WM_SERVICE_ADVISOR_IOS_PRODUCTION = 'com.whipmobility.ios.serviceadvisor',

  WM_ADMIN_ANDROID_STAGING = 'com.whipmobility.android.admin.staging',
  WM_ADMIN_ANDROID_SANDBOX = 'com.whipmobility.android.admin',
  WM_ADMIN_ANDROID_PRODUCTION = 'com.whipmobility.android.admin',
  WM_ADMIN_IOS_STAGING = 'com.whipmobility.ios.admin.staging',
  WM_ADMIN_IOS_SANDBOX = 'com.whipmobility.ios.admin',
  WM_ADMIN_IOS_PRODUCTION = 'com.whipmobility.ios.admin',

  WM_CUSTOMER_ANDROID_STAGING = 'com.whipmobility.android.customer.staging',
  WM_CUSTOMER_ANDROID_SANDBOX = 'com.whipmobility.android.customer',
  WM_CUSTOMER_ANDROID_PRODUCTION = 'com.whipmobility.android.customer',
  WM_CUSTOMER_IOS_STAGING = 'com.whipmobility.ios.customer.staging',
  WM_CUSTOMER_IOS_SANDBOX = 'com.whipmobility.ios.customer',
  WM_CUSTOMER_IOS_PRODUCTION = 'com.whipmobility.ios.customer',
  WM_SERVICE_ADVISOR_WEB_SANDBOX = 'com.whipmobility.web.serviceadvisor.sandbox',
  WM_SERVICE_ADVISOR_WEB_PRODUCTION = 'com.whipmobility.web.serviceadvisor',
  WM_SALES_ADVISOR_WEB_SANDBOX = 'com.whipmobility.web.salesadvisor.sandbox',
  WM_SALES_ADVISOR_WEB_PRODUCTION = 'com.whipmobility.web.salesadvisor',

  AB_CUSTOMER_ANDROID_CUSTOMER = 'com.autobavaria.android.customer.development',
  AB_CUSTOMER_ANDROID_STAGING = 'com.autobavaria.android.customer.staging',
  AB_CUSTOMER_ANDROID_SANDBOX = 'com.autobavaria.android.customer.sandbox',
  AB_CUSTOMER_ANDROID_PRODUCTION = 'com.autobavaria.android.customer',
  AB_CUSTOMER_IOS_STAGING = 'com.autobavaria.ios.customer.staging',
  AB_CUSTOMER_IOS_SANDBOX = 'com.autobavaria.ios.customer.sandbox',
  AB_CUSTOMER_IOS_PRODUCTION = 'com.autobavaria.ios.customer',

  CYCLEAND_CUSTOMER_ANDROID_SANDBOX = 'com.cycleandcarriage.android.customer',

  PML_CUSTOMER_ANDROID_CUSTOMER = 'com.performancemotors.android.customer.development',
  PML_CUSTOMER_ANDROID_STAGING = 'com.performancemotors.android.customer.staging',
  PML_CUSTOMER_ANDROID_SANDBOX = 'com.performancemotors.android.customer.sandbox',
  PML_CUSTOMER_ANDROID_PRODUCTION = 'com.performancemotors.android.customer',
  PML_CUSTOMER_IOS_STAGING = 'com.performancemotors.ios.customer.staging',
  PML_CUSTOMER_IOS_SANDBOX = 'com.performancemotors.ios.customer.sandbox',
  PML_CUSTOMER_IOS_PRODUCTION = 'com.performancemotors.ios.customer',

  EUROKARS_CUSTOMER_ANDROID_CUSTOMER = 'id.eurokars.bmw.android.customer.development',
  EUROKARS_CUSTOMER_ANDROID_STAGING = 'id.eurokars.bmw.android.customer.staging',
  EUROKARS_CUSTOMER_ANDROID_SANDBOX = 'id.eurokars.bmw.android.customer.sandbox',
  EUROKARS_CUSTOMER_ANDROID_PRODUCTION = 'id.eurokars.bmw.android.customer',
  EUROKARS_CUSTOMER_IOS_STAGING = 'id.eurokars.bmw.ios.customer.staging',
  EUROKARS_CUSTOMER_IOS_SANDBOX = 'id.eurokars.bmw.ios.customer.sandbox',
  EUROKARS_CUSTOMER_IOS_PRODUCTION = 'id.eurokars.bmw.ios.customer',

  VANTAGE_CUSTOMER_ANDROID_CUSTOMER = 'sg.vantage.android.customer.development',
  VANTAGE_CUSTOMER_ANDROID_STAGING = 'sg.vantage.android.customer.staging',
  VANTAGE_CUSTOMER_ANDROID_SANDBOX = 'sg.vantage.android.customer.sandbox',
  VANTAGE_CUSTOMER_ANDROID_PRODUCTION = 'sg.vantage.android.customer',
  VANTAGE_CUSTOMER_IOS_STAGING = 'sg.vantage.ios.customer.staging',
  VANTAGE_CUSTOMER_IOS_SANDBOX = 'sg.vantage.ios.customer.sandbox',
  VANTAGE_CUSTOMER_IOS_PRODUCTION = 'sg.vantage.ios.customer',

  OTOPAC_CUSTOMER_ANDROID_CUSTOMER = 'sg.otopac.android.customer.development',
  OTOPAC_CUSTOMER_ANDROID_STAGING = 'sg.otopac.android.customer.staging',
  OTOPAC_CUSTOMER_ANDROID_SANDBOX = 'sg.otopac.android.customer.sandbox',
  OTOPAC_CUSTOMER_ANDROID_PRODUCTION = 'sg.otopac.android.customer',
  OTOPAC_CUSTOMER_IOS_STAGING = 'sg.otopac.ios.customer.staging',
  OTOPAC_CUSTOMER_IOS_SANDBOX = 'sg.otopac.ios.customer.sandbox',
  OTOPAC_CUSTOMER_IOS_PRODUCTION = 'sg.otopac.ios.customer',

  HSTD_CUSTOMER_ANDROID_CUSTOMER = 'my.hstd.android.customer.development',
  HSTD_CUSTOMER_ANDROID_STAGING = 'my.hstd.android.customer.staging',
  HSTD_CUSTOMER_ANDROID_SANDBOX = 'my.hstd.android.customer.sandbox',
  HSTD_CUSTOMER_ANDROID_PRODUCTION = 'my.hstd.android.customer',
  HSTD_CUSTOMER_IOS_STAGING = 'my.hstd.ios.customer.staging',
  HSTD_CUSTOMER_IOS_SANDBOX = 'my.hstd.ios.customer.sandbox',
  HSTD_CUSTOMER_IOS_PRODUCTION = 'my.hstd.ios.customer',

  BUYTHOMAS_CUSTOMER_ANDROID_CUSTOMER = 'us.buythomas.android.customer.development',
  BUYTHOMAS_CUSTOMER_ANDROID_STAGING = 'us.buythomas.android.customer.staging',
  BUYTHOMAS_CUSTOMER_ANDROID_SANDBOX = 'us.buythomas.android.customer.sandbox',
  BUYTHOMAS_CUSTOMER_ANDROID_PRODUCTION = 'us.buythomas.android.customer',
  BUYTHOMAS_CUSTOMER_IOS_STAGING = 'us.buythomas.ios.customer.staging',
  BUYTHOMAS_CUSTOMER_IOS_SANDBOX = 'us.buythomas.ios.customer.sandbox',
  BUYTHOMAS_CUSTOMER_IOS_PRODUCTION = 'us.buythomas.ios.customer',

  CARVAULT_CUSTOMER_ANDROID_CUSTOMER = 'sg.carvault.android.customer.development',
  CARVAULT_CUSTOMER_ANDROID_STAGING = 'sg.carvault.android.customer.staging',
  CARVAULT_CUSTOMER_ANDROID_SANDBOX = 'sg.carvault.android.customer.sandbox',
  CARVAULT_CUSTOMER_ANDROID_PRODUCTION = 'sg.carvault.android.customer',
  CARVAULT_CUSTOMER_IOS_STAGING = 'sg.carvault.ios.customer.staging',
  CARVAULT_CUSTOMER_IOS_SANDBOX = 'sg.carvault.ios.customer.sandbox',
  CARVAULT_CUSTOMER_IOS_PRODUCTION = 'sg.carvault.ios.customer',
}

export const ProductGroups = {
  ServiceAdvisor: {
    staging: [
      Products.WM_SERVICE_ADVISOR_ANDROID_STAGING,
      Products.WM_SERVICE_ADVISOR_IOS_STAGING,
      Products.WM_SERVICE_ADVISOR_WEB_STAGING
    ],
    sandbox: [
      Products.WM_SERVICE_ADVISOR_ANDROID_SANDBOX,
      Products.WM_SERVICE_ADVISOR_IOS_SANDBOX,
      Products.WM_SERVICE_ADVISOR_WEB_SANDBOX,
      Products.WM_SALES_ADVISOR_WEB_SANDBOX,
    ],
    production: [
      Products.WM_SERVICE_ADVISOR_ANDROID_PRODUCTION,
      Products.WM_SERVICE_ADVISOR_IOS_PRODUCTION,
      Products.WM_SERVICE_ADVISOR_WEB_PRODUCTION,
      Products.WM_SALES_ADVISOR_WEB_PRODUCTION,
    ],
  },
  SalesAdvisor: {
    staging: [
      Products.WM_SALES_ADVISOR_ANDROID_STAGING,
      Products.WM_SALES_ADVISOR_IOS_STAGING,
      Products.WM_SALES_ADVISOR_WEB_STAGING
    ],
    sandbox: [
      Products.WM_SALES_ADVISOR_IOS_SANDBOX,
      Products.WM_SALES_ADVISOR_ANDROID_SANDBOX,
    ],
    production: [
      Products.WM_SALES_ADVISOR_IOS_PRODUCTION,
      Products.WM_SALES_ADVISOR_ANDROID_PRODUCTION,
    ],
  },
  Operation: {
    client: [Products.WM_OPERATION_ANDROID_CLIENT],
    customer: [Products.WM_OPERATION_ANDROID_CLIENT],
    staging: [
      Products.WM_OPERATION_ANDROID_STAGING,
      Products.WM_OPERATION_IOS_STAGING,
    ],
    sandbox: [
      Products.WM_OPERATION_ANDROID_SANDBOX,
      Products.WM_OPERATION_IOS_SANDBOX,
    ],
    production: [
      Products.WM_OPERATION_ANDROID_PRODUCTION,
      Products.WM_OPERATION_IOS_PRODUCTION,
    ],
  },
  Admin: {
    customer: [
      Products.WM_ADMIN_ANDROID_STAGING,
      Products.WM_ADMIN_IOS_STAGING,
    ],
    client: [Products.WM_ADMIN_ANDROID_STAGING, Products.WM_ADMIN_IOS_STAGING],
    staging: [Products.WM_ADMIN_ANDROID_STAGING, Products.WM_ADMIN_IOS_STAGING],
    sandbox: [Products.WM_ADMIN_ANDROID_SANDBOX, Products.WM_ADMIN_IOS_SANDBOX],
    production: [
      Products.WM_ADMIN_ANDROID_PRODUCTION,
      Products.WM_ADMIN_IOS_PRODUCTION,
    ],
  },
  Nerv: {
    client: [Products.NERV_CLIENT],
    customer: [Products.NERV_CUSTOMER],
    staging: [Products.NERV_STAGING],
    sandbox: [Products.NERV_SANDBOX],
    production: [Products.NERV_PRODUCTION],
  },
};

export enum OperationRole {
  CSO = 'CSO',
  SA = 'SA',
  SERVICE_ADVISOR = 'SERVICE_ADVISOR',
  SALES_ADVISOR = 'SALES_ADVISOR',
}

export const Salutation = {
  MR: 'MR',
  MS: 'MS',
  MRS: 'MRS',
  MDM: 'MDM',
  DR: 'DR',
  CAPTAIN: 'CAPTAIN',
  DATO: 'DATO',
  DATIN: 'DATIN',
  PROFESSOR: 'PROFESSOR',
  JUS: 'JUS',
};

export const DocumentType = {
  SINGAPORE_NRIC: 'SINGAPORE_NRIC',
  FOREIGN_IDENTIFICATION_NUMBER: 'FOREIGN_IDENTIFICATION_NUMBER',
  FOREIGN_PASSPORT: 'FOREIGN_PASSPORT',
  MALAYSIA_NRIC: ' MALAYSIA_NRIC',
  INDONESIA_NRIC: 'INDONESIA_NRIC',
};

export enum Storage {
  SELECTED_CORPORATE = 'selectedCorporate',
  SELECTED_BRANCH = 'selectedBranch',
}

export enum EmailType {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}
export interface Login {
  email: string;
  password: string;
  token?: string;
}

export interface Name {
  first: string;
  last: string;
}

export interface Account {
  firebase?: Firebase;
  account: AccountClass;
  corporates: ICorporates[];
}

export interface IPhone {
  code: string;
  number: string;
}

export interface AccountClass {
  uuid: string;
  uid: string;
  products: string[];
  email: string;
  phone: IPhone;
  name?: Name;
  permissions: IPermission;
  identity?: IIdentity;
  document?: IDocumentType;
  image: string;
  isSuperAdmin: boolean;
  password?: IPassword;
  isFacebookConnected: boolean;
  isAppleConnected: boolean;
  isGoogleConnected: boolean;
  isPasswordSet: boolean;
  isInitialAccess: boolean;
  isActive: boolean;
}

export interface IAccount {
  uuid: string;
  uid: string;
  email: string;
  phone: IPhone;
  isSuperAdmin: boolean;
  password?: IPassword;
  identity?: IIdentity;
  document?: IDocumentType;
  image: string;
  file: File;
  device?: any;
  products: string[];
  isFacebookConnected: boolean;
  isAppleConnected: boolean;
  isGoogleConnected: boolean;
  isInitialAccess: boolean;
  isPasswordSet: boolean;
  active: boolean;
  corporates: ICorporates[];
}

export interface IPassword {
  expiry?: string;
}

export interface IAuthorizationPayload {
  type: EmailType;
  email: string;
}
export interface IIdentity {
  salutation?: string;
  fullName: string;
}

export interface IDocumentType {
  type: string;
  id: string;
}

export interface Firebase {
  customToken: string;
}

export interface ICorporates {
  uuid: string;
  name: string;
  branches: IBranch[];
}

export interface IBranch {
  uuid: string;
  name: string;
}

export interface IPhoneCode {
  name: string;
  code: string;
}

export interface IPermissions {
  name: string;
  tags: string[];
}

export interface IPermission {
  adminGroupUuid: string;
  operationRole?: string;
}

export interface ILocation {
  address: string;
  country: string;
  state: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface ISelectedBranch {
  location: ILocation;
  name: string;
  uuid: string;
  corporateUuid: string;
}
