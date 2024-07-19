import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';

import * as fromStore from '../+state';
import { ICorporates } from '../models';

import { IInsurerModel, InsurerActions } from '@neural/modules/insurer';

@Injectable({
  providedIn: 'root',
})
export class CorporatesGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.ICorporateState | IInsurerModel>
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(map(() => true));
  }

  checkStore(): Observable<boolean> {
    this.store.dispatch(fromStore.CorporatesActions.ResetSelectedCorporate());

    this.store.dispatch(InsurerActions.ResetInsurer());

    return this.store.select(fromStore.getCorporatesLoaded).pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: ICorporates.IConfig = {
            page: 1,
            limit: ICorporates.Config.LIMIT,
          };

          this.store.dispatch(
            fromStore.CorporatesActions.SetCorporatesPage({ payload: params })
          );
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
