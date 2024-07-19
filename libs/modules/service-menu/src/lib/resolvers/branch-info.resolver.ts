import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthFacade } from '@neural/auth';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { ServicePackageFacade } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class BranchInfoResolver implements Resolve<boolean> {
  constructor(private servicePackageFacade: ServicePackageFacade,
          private authFacade: AuthFacade) {}

  resolve(): Observable<any> {
    return this.servicePackageFacade.branch$.pipe(
      tap((loaded) => {
        this.authFacade.selectedBranch.subscribe(res => {
          if(res) {
            this.servicePackageFacade.getBranch(res.uuid);
          }
        })
      }),
      filter(() => true),
      take(1)
    );
  }
}
