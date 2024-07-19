import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

// Rxjs
import { Observable } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';

// NgRx
import { AccountsFacade } from '../../+state/facades';
import { AuthFacade } from '@neural/auth';

// Models
import { IAccount } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AccountsResolver implements Resolve<boolean> {
  constructor(
    private accountsFacade: AccountsFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.accountsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IAccount.IConfig = {
            page: 1,
            limit: IAccount.Config.LIMIT,
          };
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.accountsFacade.changeAccountsPage(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
