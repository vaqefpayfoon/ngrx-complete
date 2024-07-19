import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

//Ngrx
import { OperationAccountsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class OperationsExistsResolver implements Resolve<boolean> {
  constructor(private operationAccountsFacade: OperationAccountsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.operationAccountsFacade.account$.pipe(
      tap((loaded) => {
        if (!loaded) {
          return this.operationAccountsFacade.getOperationAccount(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
