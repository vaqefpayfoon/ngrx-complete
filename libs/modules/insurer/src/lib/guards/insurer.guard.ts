import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { take, map, switchMap, catchError } from 'rxjs/operators';

// Roles
import { permissionTags } from '@neural/shared/data';

// NgRx
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class InsurerGuard implements CanActivate {
  constructor(
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkPermission([permissionTags.Insurer.LIST_INSURERS]).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkPermission(permission: string[]): Observable<boolean> {
    return this.permissionValidatorService.isAvailable(permission).pipe(
      map((key: any) => {
        if (key) {
          return key[permissionTags.Insurer.LIST_INSURERS];
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
