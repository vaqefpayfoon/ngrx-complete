import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';
import { IResponse } from '@neural/shared/data';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { IServiceLine, IServicePackage } from '../models';
import { flattenObject } from 'libs/modules/sales/src/lib/functions';
import { ICorporates } from '@neural/modules/customer/corporate';

const moment = _rollupMoment || _moment;

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class ServiceLineService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getServiceLines(
    corporateUuid: string,
    branchUuid: string,
    config: IServiceLine.IConfig,
    filters?: IServiceLine.IFilter,
    sorts?: IServiceLine.ISort
  ): Observable<IServiceLine.IData> {
    const httpParams = [];

    const createdAt = 'createdAt';

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    for (const key in flattenObject(filters)) {
      if (Object.prototype.hasOwnProperty.call(flattenObject(filters), key)) {
        if (flattenObject(filters)) {
          httpParams.push([`filter[${key}]=${flattenObject(filters)[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IServiceLine.IData>>(
        `${this.url}/v10/service-line?corporateUuid=${corporateUuid}&branchUuid=${branchUuid}`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.serviceLines),
        catchError((error: any) => throwError(error))
      );
  }

  getServiceLine(uuid: string): Observable<IServiceLine.IDocument> {
    return this.http
      .get<IResponse<IServiceLine.IDocument>>(
        `${this.url}/v10/service-line/${uuid}`
      )
      .pipe(
        map(
          (res: IResponse<IServiceLine.IDocument>) =>
            res.response.data.serviceLine
        ),
        catchError((error: any) => throwError(error))
      );
  }

  createServiceLine(
    serviceLine: IServiceLine.IDocument
  ): Observable<IServiceLine.IDocument> {
    return this.http.post(`${this.url}/v10/service-line`, serviceLine).pipe(
      map(
        (res: IResponse<IServiceLine.IDocument>) =>
          res.response.data.serviceLine
      ),
      catchError((error: any) => throwError(error))
    );
  }

  updateServiceLine(serviceLine: IServiceLine.IDocument): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/service-line/${serviceLine.uuid}`,
        serviceLine
      )
      .pipe(
        map((res) => {
          return res.response.data.serviceLine;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  changeStatusServiceLine(
    serviceLine: IServiceLine.IChangeStatus
  ): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/service-line/${serviceLine.uuid}`,
        serviceLine
      )
      .pipe(
        map((res) => {
          return res.response.data.serviceLine;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  getServiceType(uuid: string): Observable<IServiceLine.IServiceType> {
    return this.http
      .get(`${this.url}/v10/corporate/${uuid}/calendar-services`)
      .pipe(
        map((res: any) => res.response.data.services),
        catchError((error: any) => throwError(error))
      );
  }

  getCorporate(uuid: string): Observable<ICorporates.IDocument> {
    return this.http
      .get<IResponse<ICorporates.IDocument>>(
        `${this.url}/v10/corporate/${uuid}`
      )
      .pipe(
        map((res) => res.response.data.corporate),
        catchError((error: any) => throwError(error))
      );
  }

  getBrandModelList(corporateUuid: string): Observable<IServiceLine.IBrand[]> {
    return this.http
      .get<IResponse<IServiceLine.IBrand[]>>(
        `${this.url}/v10/vehicle/reference/brand-models?corporateUuid=${corporateUuid}`
      )
      .pipe(
        map((res) => res.response.data.brands),
        catchError((error: any) => throwError(error))
      );
  }

  syncServiceLineDMS(
    corporateUuid: string,
    branchUuid: string
  ): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/service-line/dms-synch/${corporateUuid}/${branchUuid}`,
        {}
      )
      .pipe(
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  synchServiceLineKaito(
    corporateUuid: string,
    branchUuid: string
  ): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/service-line/kaito-synch/${corporateUuid}/${branchUuid}`,
        {}
      )
      .pipe(
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  getFortellisServiceLineByOperationCode(corporateUuid: string, branchUuid: string, operationCode: string): Observable<IServiceLine.IFortellis> {
    return this.http
      .get<IServiceLine.IFortellis>(
        `${this.url}/v10/service-line/fortellis-operation-code/${corporateUuid}/${branchUuid}/${operationCode}`
      )
      .pipe(
        map((res: any) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  getKaitoServiceLineByOperationCode(corporateUuid: string, branchUuid: string, operationCode: string): Observable<IServiceLine.IFortellis> {
    return this.http
      .get<IServiceLine.IFortellis>(
        `${this.url}/v10/service-line/kaito-operation-code/${corporateUuid}/${branchUuid}/${operationCode}`
      )
      .pipe(
        map((res: any) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }



  getServicePackages(
    corporateUuid: string,
    branchUuid: string,
    config: IServiceLine.IConfig,
    filters?: IServiceLine.IFilter,
    sorts?: IServiceLine.ISort
  ): Observable<IServicePackage.IData> {
    const httpParams = [];

    const createdAt = 'createdAt';

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    for (const key in flattenObject(filters)) {
      if (Object.prototype.hasOwnProperty.call(flattenObject(filters), key)) {
        if (!!flattenObject(filters)[key]) {
          httpParams.push([`filter[${key}]=${flattenObject(filters)[key]}`]);
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(filters, createdAt)) {
      for (const key in filters[createdAt]) {
        if (Object.prototype.hasOwnProperty.call(filters[createdAt], key)) {
          if (!!filters[createdAt]) {
            httpParams.push([
              `filter[${createdAt}][${key}]=${moment(
                filters[createdAt][key]
              ).format('YYYY-M-DD')}`,
            ]);
          }
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IServicePackage.IData>>(
        `${this.url}/v10/service-line-package?corporateUuid=${corporateUuid}&branchUuid=${branchUuid}`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.serviceLinePackages),
        catchError((error: any) => throwError(error))
      );
  }

  getServicePackage(uuid: string): Observable<IServicePackage.IDocument> {
    return this.http
      .get<IResponse<IServicePackage.IDocument>>(
        `${this.url}/v10/service-line-package/${uuid}`
      )
      .pipe(
        map(
          (res: IResponse<IServicePackage.IDocument>) =>
            res.response.data.serviceLinePackage
        ),
        catchError((error: any) => throwError(error))
      );
  }

  createServicePackage(
    servicePackage: IServicePackage.IDocument
  ): Observable<IServicePackage.IDocument> {
    return this.http.post(`${this.url}/v10/service-line-package`, servicePackage).pipe(
      map(
        (res: IResponse<IServicePackage.IDocument>) =>
          res.response.data.serviceLinePackage
      ),
      catchError((error: any) => throwError(error))
    );
  }

  updateServicePackage(servicePackage: IServicePackage.IDocument): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/service-line-package/${servicePackage.uuid}`,
        servicePackage
      )
      .pipe(
        map((res) => {
          return res.response.data;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  changeStatusServicePackage(
    servicePackage: IServiceLine.IChangeStatus
  ): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/service-line-package/${servicePackage.uuid}`,
        servicePackage
      )
      .pipe(
        map((res) => {
          return res.response.data;
        }),
        catchError((error: any) => throwError(error))
      );
  }
}
