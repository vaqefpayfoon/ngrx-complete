import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IBrandsFlatRateUnit } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BrandsFlatRateUnitService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getBrandsFlatRateUnit({
    branchUuid,
    corporateUuid
  }: IBrandsFlatRateUnit.IGetBrandsFru): Observable<IBrandsFlatRateUnit.IData> {
    return this.http
      .get<{ response: { message: string; data: IBrandsFlatRateUnit.IData } }>(
        `${
          this.url
        }/v10/vehicle/fru/brand?corporateUuid=${corporateUuid}&branchUuid=${branchUuid}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  setBrandsFlatRateUnit(
    payload: IBrandsFlatRateUnit.ISetBrandsFru
  ): Observable<any> {
    return this.http
      .put<{ response: { message: string } }>(
        `${this.url}/v10/vehicle/fru/brand`,
        payload
      )
      .pipe(
        delay(500),
        map(res => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }
}
