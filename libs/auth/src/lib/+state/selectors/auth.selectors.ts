import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAuth from '../reducers/auth.reducer';

import { Auth } from '../../models';

export const getLoginState = createSelector(
  fromFeature.getAuthState,
  (state: fromFeature.AuthState) => state.user
);

export const getAuthLoggedIn = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.loggedIn
);

export const getAuthAccountFull = createSelector(
  getLoginState,
  ({ account, corporates, access }: fromAuth.LoginState) => {
    const AuthAccount: Auth.Account = {
      account,
      corporates,
      firebase: {
        customToken: access ? access.token : null,
      },
    };

    return AuthAccount;
  }
);

export const getAuthAccount = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.account
);

export const getSuperAdmin = createSelector(
  getAuthAccount,
  (account) => account?.isSuperAdmin
);

export const getPasswordValidity = createSelector(
  getAuthAccount,
  (account) => account?.password?.expiry
);

export const getAnonymousToken = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.anonymousToken
);

export const getAuthAccess = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.access
);

export const getAuthLoading = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.loading
);

export const getAuthError = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.error
);

export const getAuthCorporates = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.corporates
);

export const getAuthSeletedCorporate = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.selectedCorporate
);

export const getAuthSeletedBranch = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.selectedBranch
);

export const getAuthPermissions = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.permissions
);

export const getAllCountryCodes = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.codes
);

export const getTimeZone = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.timeZone
);

export const getPermissionsLoaded = createSelector(
  getLoginState,
  (state: fromAuth.LoginState) => state.permissionsLoaded
);

export const authQuery = {
  getLoginState,
  getAuthLoggedIn,
  getAuthAccountFull,
  getAuthAccount,
  getSuperAdmin,
  getAnonymousToken,
  getAuthAccess,
  getAuthLoading,
  getAuthError,
  getAuthCorporates,
  getAuthSeletedCorporate,
  getAuthSeletedBranch,
  getAuthPermissions,
  getAllCountryCodes,
  getPermissionsLoaded,
  getTimeZone,
  getPasswordValidity,
};
