import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { RolesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class RoleExistsResolver implements Resolve<boolean> {
  constructor(private rolesFacade: RolesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.rolesFacade.role$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.rolesFacade.getRole(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
