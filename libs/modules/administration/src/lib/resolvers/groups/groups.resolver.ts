import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

//Ngrx
import * as fromAuth from '@neural/auth';

import { GroupsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class GroupsResolver implements Resolve<boolean> {
  constructor(
    private groupsFacade: GroupsFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.groupsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.groupsFacade.onLoad();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
