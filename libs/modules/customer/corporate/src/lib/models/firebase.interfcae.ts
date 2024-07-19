export interface IFirebaseAppConfiguration {
  androidPackageName?: string;
  iosBundleId?: string;
  iosStoreId?: string;
  baseUrl?: string;
}

export interface IFirebaseConfiguration {
  customerApp?: IFirebaseAppConfiguration;
  operationApp?: IFirebaseAppConfiguration;
  adminApp?: IFirebaseAppConfiguration;
}
