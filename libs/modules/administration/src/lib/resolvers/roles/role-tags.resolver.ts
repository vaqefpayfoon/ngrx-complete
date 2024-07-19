import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { RoleTagsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class RoleTagsResolver implements Resolve<boolean> {
  constructor(private roleTagsFacade: RoleTagsFacade) {}

  resolve(): Observable<boolean> {
    return this.roleTagsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.roleTagsFacade.loadRoleTags();
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
