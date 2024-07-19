import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Operators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ICampaignTargets } from '../../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class CampaignTargetsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  /**
   * @description get list of capaign targets
   * @author {{Mohammad Jalili}}
   * @param {ICampaignTargets.IConfig} config
   * @param {ICampaignTargets.IFilter[]} [filters]
   * @returns {Observable<ICampaignTargets.IData>}
   * @memberof CampaignTargetsService
   */
  getCampaignTargets(
    config: ICampaignTargets.IConfig,
    filters?: ICampaignTargets.IFilter[]
  ): Observable<ICampaignTargets.IData> {
    let string = `limit=${config.limit}&page=${config.page}`;

    filters.map(filter => {
      for (const property in filter) {
        if (property) {
          string += `&filter[${property}]=${filter[property]}`;
        }
      }
    });

    const params: HttpParams = new HttpParams({
      fromString: string
    });

    return this.http
      .get<IResponse<ICampaignTargets.IData>>(
        `${this.url}/v10/campaign-target`,
        {
          params
        }
      )
      .pipe(
        delay(500),
        map(res => res.response.data.campaignTargets),
        catchError((error: any) => throwError(error))
      );
  }
}
