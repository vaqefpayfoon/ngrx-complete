export interface ISingPassCallback {
  url: string;
  token: string;
}

export interface ISingPassClient {
  id: string;
  secret: string;
}

export interface IAppFeatureAccountAuthenticationSingPass {
  active: boolean;
  attributes: string;
  callback: ISingPassCallback;
  client: ISingPassClient;
}
