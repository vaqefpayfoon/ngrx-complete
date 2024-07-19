import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { RolesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class RolesResolver implements Resolve<boolean> {
  constructor(private rolesFacade: RolesFacade) {}

  resolve(): Observable<boolean> {
    return this.rolesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.rolesFacade.onLoad();
        }
      }),
      filter((loaded) => loaded),
      take(1)
    );
  }
}
