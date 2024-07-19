import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';

import * as fromStore from '../+state';

// Models
import { IAgreements } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AgreementsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ICorporateState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(map(() => true));
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getAgreementsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.select(fromStore.getSelectedCorporate).subscribe(x => {
            if (x) {
              const params: IAgreements.IConfig = {
                corporateUuid: x.uuid
              };
              this.store.dispatch(
                fromStore.AgreementsActions.SetCorporateAgreementsPage({
                  payload: params
                })
              );
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
