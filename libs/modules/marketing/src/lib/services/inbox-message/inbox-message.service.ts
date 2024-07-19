import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// RxJs & Operators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IInboxMessages, IInbox } from '../../models';
import { IResponse } from '@neural/shared/data';

// Functions
import { flattenObject } from 'libs/modules/sales/src/lib/functions';
import { IAccount } from '@neural/modules/administration';
import { IVehicle } from '@neural/modules/customer/vehicles';

@Injectable({
  providedIn: 'root',
})
export class InboxMessageService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getInboxMessages(
    config: IInboxMessages.IConfig,
    corporateUuid: string,
    filters?: IInboxMessages.IFilter
  ): Observable<IInboxMessages.IData> {
    const httpParams = [];

    httpParams.push([`filter[corporateUuid]=${corporateUuid}`]);

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
    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IInboxMessages.IData>>(`${this.url}/v11/inbox/message`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.messages),
        catchError((error: any) => throwError(error))
      );
  }

  createInboxMessage(
    inbox: IInboxMessages.ICreate
  ): Observable<IInboxMessages.IDocument> {
    return this.http
      .post<IResponse<IInboxMessages.IDocument>>(
        `${this.url}/v10/inbox/message`,
        inbox
      )

      .pipe(
        delay(500),
        map(
          (res: IResponse<IInboxMessages.IDocument>) =>
            res.response.data.inboxMessage
        ),
        catchError((error: any) => throwError(error))
      );
  }

  sendInboxMessage(inbox: IInbox.ISendMessage): Observable<any> {
    return this.http
      .post<IResponse<any>>(`${this.url}/v11/inbox/message/campaign`, inbox)

      .pipe(
        delay(500),
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  getAccounts(config: IInboxMessages.IFilter, filters: IInboxMessages.IFilter) {
    const httpParams = [];

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
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
      .get<IResponse<IInboxMessages.IAccountData>>(
        `${this.url}/v11/account/customer`,
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

  getVehicles(
    filter: IVehicle.IFilter,
    corporateUuid: string
  ): Observable<IVehicle.IData> {
    let string = `limit=1000&page=1&filter[corporateUuid]=${corporateUuid}`;

    if (filter) {
      const key = Object.keys(filter)[0];

      string += `&filter[${key}]=${filter[key]}`;
    }
    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<IVehicle.IData>>(`${this.url}/v10/vehicle`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.vehicles),
        catchError((error: any) => throwError(error))
      );
  }
  
}
