import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { TestDrivesFacade } from '../+state';

import { AuthFacade } from '@neural/auth';

//Models
import { ITestDrives } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TestDriveBranchResolver implements Resolve<boolean> {
  constructor(
    private authFacade: AuthFacade,
    private testDrivesFacade: TestDrivesFacade
  ) {}

  resolve(): Observable<any> {
    return this.testDrivesFacade.selectedBranch$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              this.testDrivesFacade.onBranch(x.uuid);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
