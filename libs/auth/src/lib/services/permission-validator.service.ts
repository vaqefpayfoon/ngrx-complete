import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AuthState, authQuery, AuthFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class PermissionValidatorService {
  constructor(
    private store: Store<AuthState>,
    private authFacade: AuthFacade
  ) {}

  isAvailable(payload: string[]): Observable<{}> {
    return this.store.select(authQuery.getAuthPermissions).pipe(
      withLatestFrom(this.authFacade.isSuperAdmin$),
      map(([permissions, superAdmin]) => {
        if (permissions) {
          const permissionList = {};

          const entities = payload.reduce(
            (entries: { [key: string]: boolean }, permission: string) => {
              return {
                ...entries,
                [permission]: superAdmin
                  ? true
                  : permissions.tags.includes(permission),
              };
            },
            { ...permissionList }
          );

          return entities;
        }

        return of(false);
      })
    );
  }

  generateMenu(list: any[]): Observable<any[]> {
    return this.store.select(authQuery.getAuthPermissions).pipe(
      withLatestFrom(this.authFacade.isSuperAdmin$),
      switchMap(([permissions, superAdmin]) => {
        return of(chainSources(list, permissions?.tags, superAdmin));
      })
    );
  }

  calculateExpiryDays(passwordValidity: Date) {
    const currentDate = new Date();
    const days = Math.floor(
      (passwordValidity.getTime() - currentDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  }
}

export function chainSources(
  list: any[],
  permissions: string[],
  isSuperAdmin: boolean
) {
  return list.map((element) => {
    if (element.hasOwnProperty('items')) {
      chainSources(element?.items, permissions, isSuperAdmin);
      element.enabled = element?.items.some((item) => !!item?.enabled);
    } else if (element.hasOwnProperty('permission')) {
      if (isSuperAdmin) {
        element.enabled = true;
      } else {
        permissions?.includes(element['permission'])
          ? (element.enabled = true)
          : (element.enabled = false);
      }
    }
    return element;
  });
}
