import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';

import * as fromStore from '../+state';
import * as fromRoot from '@neural/ngrx-router';

@Injectable({
  providedIn: 'root'
})
export class AgreementExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ICorporateState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(switchMap(() => of(true)));
  }

  checkStore(): Observable<any> {
    return this.store.select(fromStore.getAgreementsLoaded).pipe(
      tap((loaded) => {
        if (!loaded) {
          this.store.dispatch(
            fromRoot.RouterActions.Back()
          );
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
  
}
