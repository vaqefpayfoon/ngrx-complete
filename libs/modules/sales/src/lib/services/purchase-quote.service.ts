import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IPurchases, ISales, ITradeIn } from '../models';
import { IResponse, options } from '@neural/shared/data';

//Auth
import { Auth } from '@neural/auth';

// Functions
import { flattenObject } from '../functions';

// Interceptors
const InterceptorSkipHeader = 'X-Skip-Interceptor';

// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root',
})
export class PurchaseQuoteService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getPurchaseQuotes(
    config: ISales.IConfig,
    filters?: ISales.IFilter,
    sorts?: ISales.ISort
  ): Observable<IPurchases.IData> {
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

    for (const key in sorts) {
      if (Object.prototype.hasOwnProperty.call(sorts, key)) {
        if (!!sorts[key]) {
          httpParams.push([`sort[${key}]=${sorts[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IPurchases.IData>>(`${this.url}/v10/sale/purchase-quote`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.sales),
        catchError((error: any) => throwError(error))
      );
  }

  updatePurchaseQuote({
    changes,
    sale,
  }: {
    changes: IPurchases.IUpdate;
    sale: IPurchases.IDocument | any;
  }): Observable<IPurchases.IDocument | any> {
    return this.http
      .put<IResponse<IPurchases.IDocument | any>>(
        `${this.url}/v10/sale/purchase-quote/${sale.uuid}`,
        changes
      )

      .pipe(
        delay(500),
        map((res) => {
          return {
            ...sale,
            ...res.response.data.sale,
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  completeSale(sale: IPurchases.IDocument): Observable<IPurchases.IDocument> {
    const updateDocumnet: ISales.IUpdate = {
      remark: sale.remark,
    };

    return this.http
      .put<IResponse<IPurchases.IUpdate>>(
        `${this.url}/v10/sale/${sale?.uuid}/complete`,
        updateDocumnet
      )

      .pipe(
        delay(500),
        map(() => {
          return { ...sale, ...updateDocumnet };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  cancelSale(sale: IPurchases.IDocument): Observable<IPurchases.IDocument> {
    const updateDocumnet: IPurchases.IUpdate = {
      remark: sale.remark,
    };

    return this.http
      .put<IResponse<IPurchases.IDocument>>(
        `${this.url}/v10/sale/${sale.uuid}/cancel`,
        updateDocumnet
      )
      .pipe(
        delay(500),
        map(() => {
          return { ...sale, remark: sale.remark };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  getSale(uuid: string): Observable<IPurchases.IDocument> {
    return this.http
      .get<IResponse<IPurchases.IDocument>>(
        `${this.url}/v10/sale/purchase-quote/${uuid}`
      )

      .pipe(
        delay(500),
        map((res: IResponse<IPurchases.IDocument>) => res.response.data.sale),
        catchError((error: any) => throwError(error))
      );
  }

  // todo: change filter[permissions.operationRole]
  getSaAccounts(
    corporateUuid: string,
    brnachUuid: string,
    config: ISales.IConfig
  ): Observable<ISales.ISalesAdvisorData> {
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
      .get<IResponse<ISales.ISalesAdvisorData>>(
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

  //Clear sale badge
  clearSaleBadge(
    payload: IPurchases.IUpdateBadge
  ): Observable<IPurchases.IDocument> {
    const { ['uuid']: uuid, ...rest } = payload;
    return this.http.put(`${this.url}/v10/sale/badge/${uuid}/clear`, rest).pipe(
      delay(500),
      map((res: IResponse<IPurchases.IDocument>) => res.response.data.sale),
      catchError((error: any) => throwError(error))
    );
  }

  //Clear all sale badges
  clearAllSaleBadges(uuid: string): Observable<IPurchases.IDocument> {
    return this.http.put(`${this.url}/v10/sale/badges/${uuid}/clear`, {}).pipe(
      delay(500),
      map((res: IResponse<IPurchases.IDocument>) => res.response.data.sale),
      catchError((error: any) => throwError(error))
    );
  }

  uploadSaleDocument(
    payload: ISales.IUploadFile
  ): Observable<ITradeIn.IDocument> {
    const { ['accountUuid']: accountUuid, ...object } = payload;

    const formData = serialize(object, options);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post(`${this.url}/v10/sale/upload-document/${accountUuid}`, formData, {
        headers,
      })
      .pipe(
        delay(500),
        map((res: IResponse<ITradeIn.IDocument>) => res.response.data.uploaded),
        catchError((error: any) => throwError(error))
      );
  }

  deleteSaleDocument(
    payload: ISales.IDeleteFile
  ): Observable<ISales.IDeleteFileResponse> {
    const { ['uuid']: uuid, ...rest } = payload;

    const params: HttpParams = new HttpParams({
      fromObject: {
        ...rest,
      },
    });

    return this.http
      .delete<{ response: { message: string } }>(
        `${this.url}/v10/sale/delete-document/${uuid}`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => {
          return {
            message: res.response.message,
            ...payload,
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  downloadPurchaseQuoteDocument(
    payload: IPurchases.IDownloadReport
  ): Observable<string> {
    const httpParams = [];

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (payload[key]) {
          httpParams.push(`${key}=${payload[key]}`);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });
    return this.http
      .get<IResponse<ISales.IReportData>>(
        `${this.url}/v10/analytic/report/purchase-quote/download`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.analytics.purchaseQuotes.url),
        catchError((error: any) => throwError(error))
      );
  }
}
