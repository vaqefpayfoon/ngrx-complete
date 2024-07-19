import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { AuthState } from '../reducers';

// Selector
import { authQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { AuthActions } from '../actions';

// Model
import { Auth } from '../../models';
import { IPermission } from '../../models/auth.interface';

@Injectable()
export class AuthFacade {
  isLogin$ = this.store.select(authQuery.getAuthLoggedIn);

  loading$ = this.store.select(authQuery.getAuthLoading);

  error$ = this.store.select(authQuery.getAuthError);

  anonymousToken$ = this.store.select(authQuery.getAnonymousToken);

  account$ = this.store.select(authQuery.getAuthAccount);

  getAuthAccountFull$ = this.store.select(authQuery.getAuthAccountFull);

  corporates$ = this.store.select(authQuery.getAuthCorporates);

  selectedCorporate = this.store.select(authQuery.getAuthSeletedCorporate);

  selectedBranch = this.store.select(authQuery.getAuthSeletedBranch);

  token$ = this.store.select(authQuery.getAuthAccess);

  router$ = this.store.select(fromRoot.getRouterState);

  codes$ = this.store.select(authQuery.getAllCountryCodes);

  permissions$ = this.store.select(authQuery.getAuthPermissions);

  permissionsLoaded$ = this.store.select(authQuery.getPermissionsLoaded);

  timeZone$ = this.store.select(authQuery.getTimeZone);

  isSuperAdmin$ = this.store.select(authQuery.getSuperAdmin);

  passwordValidity$ = this.store.select(authQuery.getPasswordValidity);

  constructor(private store: Store<AuthState>) {}

  getToken() {
    this.store.dispatch(AuthActions.AnonymousToken());
  }

  onUpdateSelfAccountProfile(accountProfileDetails: Auth.IAccount) {
    this.store.dispatch(
      AuthActions.UpdateSelfAccountProfile({ payload: accountProfileDetails })
    );
  }

  onUpdatePhone(phone: Auth.IPhone) {
    this.store.dispatch(AuthActions.UpdateSelfPhone({ payload: phone }));
  }

  onUpdatePassword(password: string) {
    this.store.dispatch(AuthActions.UpdateSelfPassword({ payload: password }));
  }
  onUpdateImage(file) {
    this.store.dispatch(AuthActions.UpdateSelfImage({ payload: file }));
  }
  onSelectCorporate(corporate: Auth.ICorporates) {
    this.store.dispatch(AuthActions.SelectCorporate({ payload: corporate }));
  }

  onSelectBranch(branch: Auth.IBranch) {
    this.store.dispatch(AuthActions.SelectBranch({ payload: branch }));
  }

  onReset(payload: string) {
    this.store.dispatch(AuthActions.ResetSwitcher({ payload }));
  }

  login(form: Auth.Login) {
    this.store.dispatch(AuthActions.Login({ payload: form }));
  }

  onLogout() {
    this.store.dispatch(
      AuthActions.Logout({ payload: 'You have been successfully logged out' })
    );
  }

  onRedirectFromLoginGuard(payload: IPermission) {
    this.store.dispatch(AuthActions.GoHomeFromLoginGuard({ payload }));
  }

  onRedirect() {
    this.store.dispatch(AuthActions.GoHome());
  }

  onGetCountriesCallingCodes() {
    this.store.dispatch(AuthActions.GetCountriesCallingCodes());
  }

  goHome() {
    this.store.dispatch(AuthActions.GoHome());
  }

  onRedirectToProfile() {
    this.store.dispatch(AuthActions.GoToProfile());
  }

  onContactUs() {
    this.store.dispatch(AuthActions.ContactUs());
  }
}
