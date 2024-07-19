import { Injectable } from '@angular/core';

import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromStore from '../+state';
import * as fromRoot from '@neural/ngrx-router';
import { ICorporates } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AppExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ICorporateState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const uuid = route.params.uuid;
    return this.checkStore(uuid).pipe(switchMap(() => of(true)));
  }

  checkCorporate(corporate: ICorporates.IDocument, corporateUuid: string) {
    if (!corporate) {
      this.store.dispatch(
        fromStore.CorporatesActions.LoadCorporate({ payload: corporateUuid })
      );
    }  
  }

  checkStore(uuid: string): Observable<any> {
    return this.store.select(fromStore.getSelectedApp).pipe(
      withLatestFrom(this.store.select(fromStore.getSelectedCorporate)),
      tap(([app, corporate]) => {
        if (!app) {
          this.store.dispatch(
            fromStore.AppsActions.LoadCorporateApp({ payload: uuid })
          );
        } else {
          const { corporateUuid } = app;
          this.checkCorporate(corporate, corporateUuid);
        }
      }),
      filter(([app, _]) => !!app),
      take(1)
    );
  }
}
