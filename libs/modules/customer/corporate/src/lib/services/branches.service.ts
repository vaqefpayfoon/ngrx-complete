import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IBranches } from '../models';
import { IResponse, createFormData } from '@neural/shared/data';

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

import { options } from '@neural/shared/data';
import { IAccount } from '@neural/modules/administration';
import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root',
})
export class BranchesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getBranches(corporateUuid: string): Observable<IBranches.IDocument[]> {
    return this.http
      .get<IResponse<IBranches.IDocument[]>>(
        `${this.url}/v10/branch?corporateUuid=${corporateUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branches),
        catchError((error: any) => throwError(error))
      );
  }

  getBranch(branchUuid: string): Observable<IBranches.IDocument> {
    return this.http
      .get<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/${branchUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  createBranch(object: IBranches.ICreate): Observable<IBranches.IDocument> {
    const formData = serialize(object, options);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  updateBranch(payload: IBranches.IDocument): Observable<IBranches.IDocument> {
    const {
      ['uuid']: uuid,
      ['corporateUuid']: corporateUuid,
      ['active']: active,
      ...object
    } = payload;
    // console.log(payload);
    const formData = serialize(object, options);
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.http
      .put<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/${uuid}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map(() => {
          if (payload.image && typeof payload.image !== 'string') {
            const extention = /[.]/.exec(payload.image.name)
              ? /[^.]+$/.exec(payload.image.name)
              : undefined;

            return {
              ...payload,
              image: `${this.env.s3.branch}/${payload.uuid}.${extention}`,
            };
          }
          return payload;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  getCountryNames(): Observable<string[]> {
    return this.http
      .get<IResponse<string[]>>(`${this.url}/v10/country/all`)
      .pipe(
        delay(500),
        map((res: IResponse<string[]>) => res.response.data.countries),
        catchError((error: any) => throwError(error))
      );
  }

  getCountryByName(country: string): Observable<IBranches.IGetCountry> {
    return this.http
      .get<IResponse<IBranches.IGetCountry>>(
        `${this.url}/v10/country/all/${country}`
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<IBranches.IGetCountry>) => res.response.data.country
        ),
        catchError((error: any) => throwError(error))
      );
  }

  getGlobalVehicleBrands(): Observable<string[]> {
    return this.http.get(`${this.url}/v10/vehicle/global/brand`).pipe(
      delay(500),
      map((res: any) => res.response.data.brands),
      catchError((error: any) => throwError(error))
    );
  }

  getOperationAccounts(
    corporateUuid: string,
    branchUuid: string,
    type: string
  ): Observable<IAccount.IData> {
    let string = `limit=2000&page=1&corporateUuid=${corporateUuid}&filter[permissions.operationRole]=SALES_ADVISOR&filter[permissions.operationRole]=SERVICE_ADVISOR&array[corporate.branches]=${branchUuid}`;
    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<IAccount.IData>>(`${this.url}/v11/account/operation`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.accounts),
        catchError((error: any) => throwError(error))
      );
  }

  createBranchSchedules(
    payload: IBranches.ISchedulesPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .put<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules/${payload.branchUuid}/create`,
        payload.data
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  updateBranchSchedules(
    payload: IBranches.ISchedulesPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .put<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules/${payload.data.uuid}/update?corporateUuid=${payload.corporateUuid}&branchUuid=${payload.branchUuid}`,
        payload.data
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  deleteBranchSchedules(
    payload: IBranches.ISchedulesPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .delete<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules/${payload.data.uuid}/delete?corporateUuid=${payload.corporateUuid}&branchUuid=${payload.branchUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  createScheduleTeam(
    payload: IBranches.ITeamPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .put<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules/team/${payload.scheduleUuid}/create`,
        payload.data
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  updateScheduleTeam(
    payload: IBranches.ITeamPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .put<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules/team/${payload.data.uuid}/update?corporateUuid=${payload.corporateUuid}&branchUuid=${payload.branchUuid}`,
        payload.data
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  deleteScheduleTeam(
    payload: IBranches.ITeamPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .delete<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules/team/${payload.data.uuid}/delete?corporateUuid=${payload.corporateUuid}&branchUuid=${payload.branchUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  getSchedulesOffDays(
    config: IBranches.IConfig,
    branchUuid: string
  ): Observable<IBranches.IOffDaysData> {
    const httpParams = [];

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }
    const fromString = httpParams.join('&');
    const params: HttpParams = new HttpParams({
      fromString,
    });
    return this.http
      .get<IResponse<IBranches.IOffDaysData>>(
        `${this.url}/v10/branch/schedules-off-days/${branchUuid}`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.schedulesOffDays),
        catchError((error: any) => throwError(error))
      );
  }

  createScheduleOffDays(
    payload: IBranches.IOffDaysPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .put<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules-off-days/${payload.branchUuid}/create`,
        payload.data
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  updateScheduleOffDays(
    payload: IBranches.IOffDaysPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .put<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules-off-days/${payload.data.uuid}/update?corporateUuid=${payload.corporateUuid}&branchUuid=${payload.branchUuid}`,
        payload.data
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }

  deleteScheduleOffDays(
    payload: IBranches.IOffDaysPayload
  ): Observable<IBranches.IDocument> {
    return this.http
      .delete<IResponse<IBranches.IDocument>>(
        `${this.url}/v10/branch/schedules-off-days/${payload.data.uuid}/delete?corporateUuid=${payload.corporateUuid}&branchUuid=${payload.branchUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.branch),
        catchError((error: any) => throwError(error))
      );
  }
}
