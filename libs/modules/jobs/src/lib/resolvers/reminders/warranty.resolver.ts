import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { WarrantiesFacade } from '../../+state';

//Models
import { IWarranties } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class WarrantyResolver implements Resolve<boolean> {
  constructor(private warrantiesFacade: WarrantiesFacade) {}

  resolve(): Observable<boolean> {
    return this.warrantiesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IWarranties.IConfig = {
            page: 1,
            limit: IWarranties.Config.LIMIT,
          };

          this.warrantiesFacade.setWarrantiesPage(params);
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
