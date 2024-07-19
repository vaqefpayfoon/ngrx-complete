import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CarModelsFacade } from '../+state';

import * as fromAuth from '@neural/auth';

//Model
import { IModels } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ModelsResolver implements Resolve<boolean> {
  constructor(
    private carModelsFacade: CarModelsFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.carModelsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IModels.IConfig = {
            page: 1,
            limit: IModels.Config.LIMIT,
          };
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.carModelsFacade.changeModelsPage(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
