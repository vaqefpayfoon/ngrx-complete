import { createReducer, on } from '@ngrx/store';

import { AuthActions } from '../actions';

import { Auth } from '../../models';

export interface LoginState {
  anonymousToken: string | null;
  codes: Auth.IPhoneCode[];
  account: Auth.AccountClass;
  corporates: Auth.ICorporates[];
  selectedCorporate: Auth.ICorporates;
  selectedBranch: Auth.IBranch;
  permissions: Auth.IPermissions | null;
  permissionsLoaded: boolean;
  access: { token: string };
  timeZone: string;
  loggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: LoginState = {
  anonymousToken: null,
  codes: null,
  account: null,
  corporates: null,
  selectedCorporate: null,
  selectedBranch: null,
  permissions: null,
  permissionsLoaded: false,
  loggedIn: false,
  access: null,
  timeZone: null,
  loading: false,
  error: null,
};

const authReducer = createReducer(
  initialState,

  on(AuthActions.Login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.AnonymousToken, () => {
    localStorage.clear();
    return {
      ...initialState,
    };
  }),

  on(AuthActions.AnonymousTokenSuccess, (state, { payload }) => ({
    ...state,
    anonymousToken: payload,
    loading: false,
    error: null,
  })),

  on(AuthActions.ServerAuthenticated, (state, { payload }) => {
    const { account, corporates } = payload;

    return {
      ...state,
      account,
      corporates,
      error: null,
    };
  }),

  on(AuthActions.FirebaseAuthenticated, (state, { payload }) => {
    const access = payload;

    return { ...state, access, error: null };
  }),

  on(AuthActions.LoadPermission, (state, { payload }) => {
    const permissions = payload;

    return { ...state, permissions, permissionsLoaded: true, error: null };
  }),

  on(AuthActions.LoginSuccess, (state) => ({
    ...state,
    loggedIn: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.LoginFail, (_, { payload }) => {
    const error = payload;

    return { ...initialState, error };
  }),

  on(AuthActions.FirebaseReauthenticated, (state, { payload }) => {
    const token = payload;

    return {
      ...state,
      access: {
        ...state.access,
        token,
      },
      error: null,
    };
  }),

  on(AuthActions.ReLoadPermission, (state, { payload }) => {
    const permissions = payload;
    return {
      ...state,
      permissions,
      permissionsLoaded: true,
      error: null,
    };
  }),

  on(AuthActions.AccountClassSuccess, (state, { payload }) => {
    const { account, corporates } = payload;

    const selectedCorporate = JSON.parse(
      localStorage.getItem(Auth.Storage.SELECTED_CORPORATE)
    );

    const selectedBranch = JSON.parse(
      localStorage.getItem(Auth.Storage.SELECTED_BRANCH)
    );

    const [firstCorporate] = corporates;

    const [firstBranch] = firstCorporate.branches;

    return {
      ...state,
      loggedIn: true,
      account,
      corporates,
      selectedCorporate: selectedCorporate ?? firstCorporate,
      selectedBranch: selectedBranch ?? firstBranch,
      error: null,
    };
  }),

  on(AuthActions.SelectCorporate, (state, { payload }) => {
    const selectedCorporate = payload;

    localStorage.setItem(
      'selectedCorporate',
      JSON.stringify(selectedCorporate)
    );

    return {
      ...state,
      selectedCorporate,
      error: null,
    };
  }),

  on(AuthActions.SelectBranch, (state, { payload }) => {
    const selectedBranch = payload;

    localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch));

    return {
      ...state,
      selectedBranch,
      error: null,
    };
  }),

  on(AuthActions.UpdateSelfAccountProfileSuccess, (state, { payload }) => {
    const { identity, document } = payload;
    return {
      ...state,
      account: {
        ...state.account,
        identity,
        document,
      },
    };
  }),

  on(AuthActions.UpdateSelfPhoneSuccess, (state, { payload }) => {
    const phone = payload;

    return {
      ...state,
      account: {
        ...state.account,
        phone,
      },
    };
  }),

  on(AuthActions.UpdateSelfImageSuccess, (state, { payload }) => {
    const { image } = payload;
    return {
      ...state,
      account: {
        ...state.account,
        image,
      },
    };
  }),

  on(AuthActions.ResetSwitcher, (state, { payload }) => {
    localStorage.removeItem(payload);
    return {
      ...state,
      [payload]: null,
    };
  }),

  on(AuthActions.GetCountriesCallingCodesSuccess, (state, { payload }) => {
    const codes = payload;

    return {
      ...state,
      loading: false,
      error: null,
      codes,
    };
  }),

  on(AuthActions.GetTimeZoneSuccess, (state, { payload }) => {
    const timeZone = payload;
    return {
      ...state,
      timeZone,
    };
  })
);

export function reducer(
  state: LoginState | undefined,
  action: AuthActions.AuthActionsUnion
) {
  return authReducer(state, action);
}
