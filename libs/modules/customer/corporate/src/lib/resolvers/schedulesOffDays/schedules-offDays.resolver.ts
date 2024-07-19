import { Injectable } from '@angular/core';

import { ActivatedRoute, Resolve } from '@angular/router';
import { of } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { BranchFacade } from '../../+state';

@Injectable({
  providedIn: 'root'
})
export class SchedulesOffDaysResolver implements Resolve<any> {
  constructor(private route: ActivatedRoute,
    private branchFacade: BranchFacade) {}

  resolve(): any {
    return this.branchFacade.schedulesOffDays$.pipe(
      tap((loaded) => {
        this.route.params.subscribe(x => {
          this.branchFacade.onSchedulesOffDays(x.uuid);
        })
        return of(true);
      }),
      take(1)
    )
  }
}
