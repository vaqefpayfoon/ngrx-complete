import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';

import * as fromStore from '../+state';

@Injectable({
  providedIn: 'root'
})
export class BranchesGuard implements CanActivate {
  constructor(private store: Store<fromStore.ICorporateState>) {}

  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(map(() => true));
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getBranchesLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.select(fromStore.getSelectedCorporate).subscribe(x => {
            if (x) {
              this.store.dispatch(
                fromStore.BranchesActions.LoadBranches({ payload: x.uuid })
              );
            }
          });
        }
        this.store.dispatch(fromStore.BranchesActions.LoadCountryNames());
      }),
      filter(() => true),
      take(1)
    );
  }
}
