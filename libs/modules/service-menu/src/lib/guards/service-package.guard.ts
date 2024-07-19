import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { take, map, switchMap, catchError } from 'rxjs/operators';

// Roles
import { permissionTags } from '@neural/shared/data';

// NgRx
import * as fromAuth from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class ServicePackageGuard implements CanActivate {
  constructor(
    private authFacade: fromAuth.AuthFacade,
    private permissionValidatorService: fromAuth.PermissionValidatorService
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkPermission([
      permissionTags.ServiceLinePackage.LIST_SERVICE_LINE_PACKAGES,
      permissionTags.ServiceLinePackage.LIST_SELF_SERVICE_LINE_PACKAGES,
    ]).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkPermission(permission: string[]): Observable<boolean> {
    return this.permissionValidatorService.isAvailable(permission).pipe(
      map((key) => {
        if (key) {
          return key[
            (permissionTags.ServiceLinePackage.LIST_SERVICE_LINE_PACKAGES,
            permissionTags.ServiceLinePackage.LIST_SELF_SERVICE_LINE_PACKAGES)
          ];
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
