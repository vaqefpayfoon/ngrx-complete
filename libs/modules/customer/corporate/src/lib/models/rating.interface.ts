
export interface IRatingMobileService {
  active: boolean;
  title?: string;
}

export interface IRatingServiceCenter extends IRatingMobileService {}

export interface IAppFeatureRating {
  active: boolean;
  title: string;
  // mobileService?: IRatingMobileService;
  // serviceCenter?: IRatingServiceCenter;
}
