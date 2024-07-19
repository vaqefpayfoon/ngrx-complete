import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthFacade } from '@neural/auth';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { ServiceLineFacade } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class BranchResolver implements Resolve<boolean> {
  constructor(private serviceLineFacade: ServiceLineFacade,
          private authFacade: AuthFacade) {}

  resolve(): Observable<any> {
    return this.serviceLineFacade.branch$.pipe(
      tap((loaded) => {
        this.authFacade.selectedBranch.subscribe(res => {
          if(res) {
            this.serviceLineFacade.getBranch(res.uuid);
          }
        })
      }),
      filter(() => true),
      take(1)
    );
  }
}
