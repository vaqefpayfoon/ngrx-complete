import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IDashboard } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getBasicDashboard(corporateUuid: string): Observable<IDashboard.IBasic> {
    return this.http
      .get<IResponse<IDashboard.IBasic>>(
        `${this.url}/v10/analytic/dashboard/basic/${corporateUuid}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.analytics),
        catchError((error: any) => throwError(error))
      );
  }
}
