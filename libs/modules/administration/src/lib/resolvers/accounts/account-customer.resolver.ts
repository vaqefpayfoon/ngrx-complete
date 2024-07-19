import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

// Rxjs
import { Observable } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';

// NgRx
import { AuthFacade } from '@neural/auth';
import { CustomerAccountsFacade } from '../../+state';

// Model
import { IAccount } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AccountCustomerResolver implements Resolve<boolean> {
  constructor(
    private customerAccountsFacade: CustomerAccountsFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.customerAccountsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IAccount.IConfig = {
            page: 1,
            limit: IAccount.Config.LIMIT,
          };

          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.customerAccountsFacade.changeAccountsPage(params);
              this.customerAccountsFacade.getCorporate(x.uuid);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
