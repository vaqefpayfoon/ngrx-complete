import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICorporateState } from '../reducers';

// Selector
import { AppsQuery } from '../selectors';

// Action
import { AppsActions } from '../actions';

// Models
import { IApps } from '../../models';

@Injectable()
export class AppsFacade {
  total$ = this.store.select(AppsQuery.getAppsTotals);

  loaded$ = this.store.select(AppsQuery.getAppsLoaded);

  loading$ = this.store.select(AppsQuery.getAppsLoading);

  error$ = this.store.select(AppsQuery.getAppsError);

  apps$ = this.store.select(AppsQuery.getAllApps);

  app$ = this.store.select(AppsQuery.getSelectedApp);

  corporateAppsConfig$ = this.store.select(AppsQuery.getCorporateAppsConfig);

  token$ = this.store.select(AppsQuery.getAppToken);

  constructor(private store: Store<ICorporateState>) {}

  setCorporateAppsPage(config: IApps.IConfig) {
    this.store.dispatch(AppsActions.SetCorporateAppsPage({ payload: config }));
  }

  create(payload: IApps.ICreate) {
    this.store.dispatch(AppsActions.CreateCorporateApp({ payload }));
  }

  update(payload: IApps.IDocument) {
    this.store.dispatch(AppsActions.UpdateCorporateApp({ payload }));
  }

  regenerateCorporateAppToken(payload: IApps.IDocument) {
    this.store.dispatch(AppsActions.RegenerateCorporateAppToken({ payload }));
  }

  resetToken() {
    this.store.dispatch(AppsActions.ResetCorporateAppToken());
  }

  toggleStatus(corporateApp: IApps.IDocument) {
    if (corporateApp.active) {
      this.store.dispatch(
        AppsActions.DeactivateCorporateApp({ payload: corporateApp })
      );
    } else {
      this.store.dispatch(
        AppsActions.ActivateCorporateApp({ payload: corporateApp })
      );
    }
  }

  resetToggle(corporateApp: IApps.IDocument) {
    this.store.dispatch(
      AppsActions.ResetCorporateAppStatus({
        payload: {
          id: corporateApp.uuid,
          changes: {
            active: corporateApp.active
          }
        }
      })
    );
  }

  onResetSelectedApp() {
    this.store.dispatch(AppsActions.ResetSelectedApp());
  }
}
