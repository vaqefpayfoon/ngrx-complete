import { InjectionToken, Provider } from '@angular/core';

export const ENVIRONMENT = new InjectionToken('ENVIRONMENT');

export interface Environment {
  name: 'development' | 'staging' | 'sandbox' | 'production';
  production: boolean;
  staging: boolean;
  sandbox: boolean;
  development: boolean;
  version: string;
  identifier: string;
  api: {
    community: string;
    application: string;
  };
  google: {
    maps: {
      apiKey: string;
    };
    firebase: {
      apiKey: string;
      authDomain: string;
      databaseURL: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;
    };
  };
  providers: Provider[];
  ga?: string;
  s3?: {
    corporate: string;
    branch: string;
    agreement: string;
    account: string;
    fonts?: string[];
  };
}
