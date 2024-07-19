import { Injectable } from '@angular/core';

// Router
import {
  CanActivate,
  CanLoad,
  CanActivateChild,
  Router
} from '@angular/router';

// NgRx store
import { Store } from '@ngrx/store';

// Auth store
import * as fromStore from '../+state';

// RxJs & operators 
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, filter, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CallingCodesExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.AuthState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(map(() => true));
  }

  checkStore(): Observable<any> {
    return this.store.select(fromStore.getAllCountryCodes).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(fromStore.AuthActions.GetCountriesCallingCodes());
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}