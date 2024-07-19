import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CampaignTemplatesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class CampaignTemplateExistsResolver implements Resolve<boolean> {
  constructor(private campaignTemplatesFacade: CampaignTemplatesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.campaignTemplatesFacade.template$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.campaignTemplatesFacade.getCampaignTemplate(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
