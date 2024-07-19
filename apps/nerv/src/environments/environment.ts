// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from '@neural/environment';

import { version } from '@neural/package';

export const environment: Environment = {
  name: 'development',
  production: false,
  staging: false,
  sandbox: false,
  development: true,
  version: `${version}-dev`,
  identifier: 'io.whipmobility.nerv',
  api: {
    community: 'https://skyrim.whipmobility.io',
    application: 'http://localhost:4200',
  },
  google: {
    maps: {
      apiKey: 'AIzaSyCYuBxZWuZ_YNkO8AR5tU8puDxbEsEr4ec',
    },
    firebase: {
      apiKey: 'AIzaSyA9IG_MsXK9anRjY1n54yOQuhibzzHVV_A',
      authDomain: 'wm-staging-780c5.firebaseapp.com',
      databaseURL: 'https://wm-staging-780c5.firebaseio.com',
      projectId: 'wm-staging-780c5',
      storageBucket: 'wm-staging-780c5.appspot.com',
      messagingSenderId: '891400160565',
      appId: '1:891400160565:web:e72e0601d8edad12',
      measurementId: 'G-43C6BR2T5D',
    },
  },
  providers: [],
  ga: 'G-ZK0S34ED45',
  s3: {
    corporate:
      'https://wm-staging-asset.s3-ap-southeast-1.amazonaws.com/corporate/image',
    branch:
      'https://wm-staging-asset.s3-ap-southeast-1.amazonaws.com/branch/image',
    agreement:
      'https://wm-staging-asset.s3-ap-southeast-1.amazonaws.com/corporate/agreement',
    account:
      'https://wm-staging-asset.s3-ap-southeast-1.amazonaws.com/account/photo',
    fonts: [
      'https://wm-staging-asset-web.s3-ap-southeast-1.amazonaws.com/fonts/BMW/stylesheet.css',
      'https://wm-staging-asset-web.s3-ap-southeast-1.amazonaws.com/fonts/MINI/stylesheet.css',
    ],
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
