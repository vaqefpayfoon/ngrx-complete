import { Environment } from '@neural/environment';

import { version } from '@neural/package';

export const environment: Environment = {
  name: 'staging',
  production: false,
  staging: true,
  sandbox: false,
  development: false,
  version: `${version}-client-staging`,
  identifier: 'io.whipmobility.nerv-client',
  api: {
    community: 'https://skyrim-client.whipmobility.io',
    application: 'https://nerv-client.whipmobility.io',
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
