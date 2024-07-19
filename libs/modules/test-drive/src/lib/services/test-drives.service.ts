import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ITestDrives } from '../models';
import { IResponse } from '@neural/shared/data';
import { Auth } from '@neural/auth';

import { flattenObject } from '../functions';

@Injectable({
  providedIn: 'root',
})
export class TestDrivesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getTestDrives(
    config: ITestDrives.IConfig,
    filters?: ITestDrives.IFilter,
    sorts?: ITestDrives.ISort
  ): Observable<ITestDrives.IData> {
    const httpParams = [];
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    for (const key in sorts) {
      if (Object.prototype.hasOwnProperty.call(sorts, key)) {
        if (!!sorts[key]) {
          httpParams.push([`sort[${key}]=${sorts[key]}`]);
        }
      }
    }
 
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (!!filters[key]) {
          httpParams.push([`filter[${key}]=${filters[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<ITestDrives.IData>>(`${this.url}/v10/test-drive`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.testDrives),
        catchError((error: any) => throwError(error))
      );
  }

  getTestDrive(uuid: string): Observable<ITestDrives.IDocument> {
    return this.http
      .get<IResponse<ITestDrives.IDocument>>(
        `${this.url}/v10/test-drive/${uuid}`
      )
      .pipe(
        delay(500),
        map((res) => res?.response?.data?.testDrive),
        catchError((error: any) => throwError(error))
      );
  }

  cancelTestDrive(
    payload: ITestDrives.IDocument
  ): Observable<ITestDrives.IDocument> {
    return this.http
      .put(`${this.url}/v10/test-drive/cancel/${payload.uuid}`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  completeTestDrive(
    payload: ITestDrives.IDocument
  ): Observable<ITestDrives.IDocument> {
    return this.http
      .put(`${this.url}/v10/test-drive/complete/${payload.uuid}`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  updateTestDrive(
    updateDocumnet: ITestDrives.IDocument
  ): Observable<ITestDrives.IDocument> {
    return this.http
      .put<IResponse<ITestDrives.IDocument>>(
        `${this.url}/v10/test-drive/${updateDocumnet.uuid}`,
        { payload: updateDocumnet.payload }
      )

      .pipe(
        delay(500),
        map((res) => {
          return {
            ...updateDocumnet,
            ...res.response?.data?.testDrive,
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  // todo: change filter[permissions.operationRole]
  getSaAccounts(
    corporateUuid: string,
    brnachUuid: string,
    config: ITestDrives.IConfig
  ): Observable<ITestDrives.ISalesAdvisorData> {
    const string = `limit=${config.limit}&page=${
      config.page
    }&corporateUuid=${corporateUuid}&filter[corporate.branches][]=${brnachUuid}&filter[permissions.operationRole]=${
      this.env.production
        ? Auth.OperationRole.SA
        : Auth.OperationRole.SALES_ADVISOR
    }`;

    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<ITestDrives.ISalesAdvisorData>>(
        `${this.url}/v11/account/operation`,
        {
          params,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.accounts),
        catchError((error: any) => throwError(error))
      );
  }

  getTestDriveCalendar(
    filters: {filter: ITestDrives.IFilter, adtorque: boolean},
  ): Observable<ITestDrives.ITestDriveCalendar[]> {
    const string = [];

    for (const key in filters.filter) {
      if (Object.prototype.hasOwnProperty.call(filters.filter, key)) {
        string.push([`${key}=${filters.filter[key]}`]);
      }
    }

    const params: HttpParams = new HttpParams({
      fromString: string.join('&'),
    });
    let path = '/v11/calendar/test-drive';
    if(filters?.adtorque) {
      path = '/v10/calendar/test-drive/pre-owned';
    }
    return this.http
      .get<IResponse<ITestDrives.ITestDriveCalendar[]>>(
        `${this.url}${path}`,
        {
          params,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.calendars),
        catchError((error: any) => throwError(error))
      );
  }
}
