import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';

import { Observable, of } from 'rxjs';
import { take, map, switchMap, catchError } from 'rxjs/operators';

import * as fromAuth from '@neural/auth';

// Validator
import { PermissionValidatorService } from '@neural/auth';

// Roles
import { permissionTags } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class AccountOperationExistsGuard implements CanActivate {
  constructor(
    private authFacade: fromAuth.AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkPermission([permissionTags.Account.GET_ACCOUNT]).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkPermission(permission: string[]): Observable<boolean> {
    return this.permissionValidatorService.isAvailable(permission).pipe(
      map((key) => {
        if (key) {
          return key[permissionTags.Account.GET_ACCOUNT];
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
