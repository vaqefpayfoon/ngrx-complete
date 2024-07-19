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
export class TestDrivesResolver implements Resolve<boolean> {
  constructor(
    private authFacade: AuthFacade,
    private testDrivesFacade: TestDrivesFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.testDrivesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: ITestDrives.IConfig = {
            page: 1,
            limit: ITestDrives.Config.LIMIT,
          };
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              this.testDrivesFacade.changeTestDrivesPage(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
