import { Environment } from '@neural/environment';

import { version } from '@neural/package';

export const environment: Environment = {
  name: 'production',
  production: true,
  staging: false,
  sandbox: false,
  development: false,
  version: `${version}-production`,
  identifier: 'com.whipmobility.nerv',
  api: {
    community: 'https://skyrim.whipmobility.com',
    application: 'https://nerv.whipmobility.com',
  },
  google: {
    maps: {
      apiKey: 'AIzaSyCYuBxZWuZ_YNkO8AR5tU8puDxbEsEr4ec',
    },
    firebase: {
      apiKey: 'AIzaSyCYuBxZWuZ_YNkO8AR5tU8puDxbEsEr4ec',
      authDomain: 'wm-production-12781.firebaseapp.com',
      databaseURL: 'https://wm-production-12781.firebaseio.com',
      projectId: 'wm-production-12781',
      storageBucket: 'wm-production-12781.appspot.com',
      messagingSenderId: '24576933558',
      appId: '1:24576933558:web:b79d6c0cf86d439cbcb017',
      measurementId: 'G-GLECC8DP6L',
    },
  },
  providers: [],
  ga: 'G-9L8R92PVCM',
  s3: {
    corporate:
      'https://wm-production-asset.s3-ap-southeast-1.amazonaws.com/corporate/image',
    branch:
      'https://wm-production-asset.s3-ap-southeast-1.amazonaws.com/branch/image',
    agreement:
      'https://wm-production-asset.s3-ap-southeast-1.amazonaws.com/corporate/agreement',
    account:
      'https://wm-production-asset.s3-ap-southeast-1.amazonaws.com/account/photo',
    fonts: [
      'https://wm-production-asset-web.s3-ap-southeast-1.amazonaws.com/fonts/BMW/stylesheet.css',
      'https://wm-production-asset-web.s3-ap-southeast-1.amazonaws.com/fonts/MINI/stylesheet.css',
    ],
  },
};
