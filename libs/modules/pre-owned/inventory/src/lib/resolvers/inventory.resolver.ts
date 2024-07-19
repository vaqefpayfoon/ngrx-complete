import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { InventoryFacade } from '../+state/facades';

//AuthFacade
import { AuthFacade } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class InventoryResolver implements Resolve<boolean> {
  constructor(
    private authFacade: AuthFacade,
    private inventoryFacade: InventoryFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.inventoryFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              const uuid = x.uuid;

              this.inventoryFacade.getInventoryImports(uuid);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
