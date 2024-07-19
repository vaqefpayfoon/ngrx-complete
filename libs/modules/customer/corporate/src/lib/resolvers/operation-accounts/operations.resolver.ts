import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

// Rxjs
import { Observable, of } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';

import { OperationAccountsFacade } from '../../+state/facades';
import { IBranches } from '../../models';


@Injectable({
  providedIn: 'root',
})
export class OperationsResolver implements Resolve<boolean> {
  constructor(
    private operationAccountsFacade: OperationAccountsFacade,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.operationAccountsFacade.accounts$.pipe(
      tap((loaded) => {
        const uuid = route.params.uuid;
        const cUuid = route.params.cUuid;
        const event: IBranches.IOperationPayload = {
          type: '',
          corporateUuid: cUuid,
          branchUuid: uuid
        }
        this.operationAccountsFacade.getAccounts(event);
        return of(true);
      }),
      filter(() => true),
      take(1)
    );
  }
}
