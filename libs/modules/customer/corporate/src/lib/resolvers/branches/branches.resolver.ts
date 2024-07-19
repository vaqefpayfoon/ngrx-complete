import { Injectable } from '@angular/core';

import { CanActivate, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';
import { AuthFacade } from '@neural/auth';
import { BranchFacade } from '../../+state';

@Injectable({
  providedIn: 'root'
})
export class BranchesResolver implements Resolve<any> {
  constructor(private authFacade: AuthFacade,
    private branchFacade: BranchFacade) {}

  resolve(): any {
    return this.authFacade.selectedCorporate.subscribe(corporate => {
      return this.branchFacade.onLoad(corporate.uuid)
    });
  }
}
