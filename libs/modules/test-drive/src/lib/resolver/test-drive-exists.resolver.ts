import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { TestDrivesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class TestDriveExistsResolver implements Resolve<boolean> {
  constructor(private testDrivesFacade: TestDrivesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.testDrivesFacade.testDrive$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.testDrivesFacade.getTestDrive(uuid);
          this.testDrivesFacade.getTestDriveSalesAdvisors();
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
