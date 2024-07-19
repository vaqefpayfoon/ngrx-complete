import { Environment } from '@neural/environment';

import { version } from '@neural/package';

export const environment: Environment = {
  name: 'sandbox',
  production: false,
  sandbox: true,
  staging: false,
  development: false,
  version: `${version}-sandbox`,
  identifier: 'cloud.whipmobility.nerv',
  api: {
    community: 'https://skyrim.whipmobility.cloud',
    application: 'https://nerv.whipmobility.cloud',
  },
  google: {
    maps: {
      apiKey: 'AIzaSyBWJ-boCuNtrG5Z_nCKFayTZDtUvkw2B10',
    },
    firebase: {
      apiKey: 'AIzaSyBWJ-boCuNtrG5Z_nCKFayTZDtUvkw2B10',
      authDomain: 'wm-sandbox.firebaseapp.com',
      databaseURL: 'https://wm-sandbox.firebaseio.com',
      projectId: 'wm-sandbox',
      storageBucket: 'wm-sandbox.appspot.com',
      messagingSenderId: '904480899273',
      appId: '1:904480899273:web:1d88d48f77b697e03a4d18',
      measurementId: 'G-D0ZQ2RZC7H',
    },
  },
  providers: [],
  ga: 'G-9T3XX2XYV9',
  s3: {
    corporate:
      'https://wm-sandbox-asset.s3-ap-southeast-1.amazonaws.com/corporate/image',
    branch:
      'https://wm-sandbox-asset.s3-ap-southeast-1.amazonaws.com/branch/image',
    agreement:
      'https://wm-sandbox-asset.s3-ap-southeast-1.amazonaws.com/corporate/agreement',
    account:
      'https://wm-sandbox-asset.s3-ap-southeast-1.amazonaws.com/account/photo',
    fonts: [
      'https://wm-sandbox-asset-web.s3-ap-southeast-1.amazonaws.com/fonts/BMW/stylesheet.css',
      'https://wm-sandbox-asset-web.s3-ap-southeast-1.amazonaws.com/fonts/MINI/stylesheet.css',
    ],
  },
};
