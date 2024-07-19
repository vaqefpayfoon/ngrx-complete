import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { MasterTemplatesFacade } from '../../+state';

//Model
import { ITemplates } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MasterTemplatesResolver implements Resolve<boolean> {
  constructor(private masterTemplatesFacade: MasterTemplatesFacade) {}

  resolve(): Observable<boolean> {
    return this.masterTemplatesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const config: ITemplates.IConfig = {
            page: 1,
            limit: 1000,
          };

          const filters: ITemplates.IFilter[] = [
            {
              isMaster: 1,
            },
          ];
          this.masterTemplatesFacade.changeMasterTemplatesPage(config, filters);
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
