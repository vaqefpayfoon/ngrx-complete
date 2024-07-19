import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';

import { Observable, of } from 'rxjs';
import { take, map, switchMap, catchError } from 'rxjs/operators';

import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// Roles
import { permissionTags } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class BankLoansBySaleGuard implements CanActivate {
  constructor(
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkPermission([
      permissionTags.BankLoan.LIST_BANK_LOANS_BY_SALE,
    ]).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkPermission(permission: string[]): Observable<boolean> {
    return this.permissionValidatorService.isAvailable(permission).pipe(
      map((key) => {
        if (key) {
          return key[permissionTags.BankLoan.LIST_BANK_LOANS_BY_SALE];
        }

        return of(false);
      }),
      map((permitted) => {
        if (!permitted) {
          this.authFacade.goHome();

          return of(false);
        }

        return permitted;
      }),
      take(1)
    );
  }
}
