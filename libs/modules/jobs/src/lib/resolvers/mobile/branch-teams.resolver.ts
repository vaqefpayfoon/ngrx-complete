import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { BranchTeamFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class BranchTeamsResolver implements Resolve<boolean> {
  constructor(
    private BranchTeamFacade: BranchTeamFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.BranchTeamFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              this.BranchTeamFacade.onLoad();
            }
          });
        }
      }),
      filter((loaded) => loaded),
      take(1)
    );
  }
}
