import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';

import { Observable, of } from 'rxjs';
import { take, map, switchMap, catchError } from 'rxjs/operators';

// Facades
import * as fromAuth from '@neural/auth';

// Roles
import { permissionTags } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class DashboardBasicGuard implements CanActivate {
  constructor(
    private authFacade: fromAuth.AuthFacade,
    private permissionValidatorService: fromAuth.PermissionValidatorService
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkPermission([permissionTags.Analytic.BASIC_DASHBOARD]).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkPermission(permission: string[]): Observable<boolean> {
    return this.permissionValidatorService.isAvailable(permission).pipe(
      map((key) => {
        if (key) {
          return key[permissionTags.Analytic.BASIC_DASHBOARD];
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
