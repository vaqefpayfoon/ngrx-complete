import { Injectable } from '@angular/core';

import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap } from 'rxjs/operators';

import * as fromStore from '../+state';

@Injectable({
  providedIn: 'root'
})
export class CorporateExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ICorporateState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const uuid = route.params.uuid;
    return this.checkStore(uuid).pipe(switchMap(() => of(true)));
  }

  checkStore(uuid: string): Observable<any> {
    return this.store.select(fromStore.getSelectedCorporate).pipe(
      tap((loaded) => {
        if (!loaded) {
          this.store.dispatch(
            fromStore.CorporatesActions.LoadCorporate({ payload: uuid })
          );
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
