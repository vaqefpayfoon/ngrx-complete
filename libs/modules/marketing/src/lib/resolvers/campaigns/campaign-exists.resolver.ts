import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CampaignsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class CampaignExistsResolver implements Resolve<boolean> {
  constructor(private campaignsFacade: CampaignsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.campaignsFacade.campaign$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.campaignsFacade.getCampaign(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
