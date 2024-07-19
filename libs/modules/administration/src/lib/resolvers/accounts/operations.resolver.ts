import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

// Rxjs
import { Observable } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';

// NgRx
import { AuthFacade } from '@neural/auth';
import { OperationAccountsFacade } from '../../+state/facades';

// Models
import { IAccount } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class OperationsResolver implements Resolve<boolean> {
  constructor(
    private operationAccountsFacade: OperationAccountsFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.operationAccountsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IAccount.IConfig = {
            page: 1,
            limit: IAccount.Config.LIMIT,
          };
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.operationAccountsFacade.changeAccountsPage(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
