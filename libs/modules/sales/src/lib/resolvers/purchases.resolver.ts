import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { PurchasesFacade } from '../+state/facades';

import { AuthFacade } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class PurchasesResolver implements Resolve<boolean> {
  constructor(
    private authFacade: AuthFacade,
    private purchasesFacade: PurchasesFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.purchasesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              this.purchasesFacade.resetPurchasesPage();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
