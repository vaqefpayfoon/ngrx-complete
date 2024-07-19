import { Injectable } from '@angular/core';

import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromStore from '../+state';

// Models
import { ICorporates } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BranchExistsGuard implements CanActivate {
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
    return this.store.select(fromStore.getSelectedBranch).pipe(
      withLatestFrom(this.store.select(fromStore.getSelectedCorporate)),
      tap(([branch, corporate]) => {
        if (!branch) {
          this.store.dispatch(
            fromStore.BranchesActions.GetBranch({ payload: uuid })
          );
        } else {
          const { corporateUuid } = branch;
          this.checkCorporate(corporate, corporateUuid);
        }
      }),
      filter(([branch, _]) => !!branch),
      take(1)
    );
  }

}
