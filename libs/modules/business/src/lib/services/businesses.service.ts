import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IAccount } from '@neural/modules/administration';
import { IBusinesses } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class BusinessesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getBusinesses(config: IBusinesses.IConfig): Observable<IBusinesses.IData> {
    return this.http
      .get<IResponse<IBusinesses.IData>>(
        `${this.url}/v10/business?limit=${config.limit}&page=${config.page}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.businesses),
        catchError((error: any) => throwError(error))
      );
  }

  activateBusiness(payload: IBusinesses.IDocument) {
    return this.http
      .put(`${this.url}/v10/business/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateBusinesses(payload: IBusinesses.IDocument) {
    return this.http
      .put(`${this.url}/v10/business/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  createBusiness(
    business: IBusinesses.ICreate
  ): Observable<IBusinesses.IDocument> {
    return this.http.post(`${this.url}/v10/business`, business).pipe(
      delay(500),
      map(
        (res: IResponse<IBusinesses.IDocument>) => res.response.data.business
      ),
      catchError((error: any) => throwError(error))
    );
  }

  getBusiness(uuid: string): Observable<IBusinesses.IDocument> {
    return this.http
      .get<IResponse<IBusinesses.IDocument>>(`${this.url}/v10/business/${uuid}`)
      .pipe(
        delay(500),
        map((res: IResponse<IBusinesses.IDocument>) => res.response.data.business),
        catchError((error: any) => throwError(error))
      );
  }

  updateBusiness(
    business: IBusinesses.IDocument
  ): Observable<IBusinesses.IDocument> {
    const {
      description,
      name,
      registrationNumber,
      type
    }: IBusinesses.IUpdate = business;

    const businessParams: IBusinesses.IUpdate = {
      description,
      name,
      registrationNumber,
      type
    };

    return this.http
      .put<IResponse<IBusinesses.IDocument>>(
        `${this.url}/v10/business/${business.uuid}`,
        businessParams
      )
      .pipe(
        delay(500),
        map(() => business),
        catchError((error: any) => throwError(error))
      );
  }

  assosiateAccounts(business: IBusinesses.IAssociate): Observable<any> {
    const { accountUuids, uuid } = business;
    return this.http
      .put(`${this.url}/v10/business/${uuid}/associate`, { accountUuids })
      .pipe(
        delay(500),
        map(res => res),
        catchError((error: any) => throwError(error))
      );
  }

  getAccounts(
    config: IBusinesses.ISearch[],
    pagination?: IBusinesses.IConfig
  ): Observable<IAccount.IData> {
    let string: string = config
      .map(x => {
        for (const key in x) {
          if (x.hasOwnProperty(key)) {
            return `${key}=${x[key]}`;
          }
        }
      })
      .join('&');

    if (pagination) {
      string += `&limit=${pagination.limit}&page=${pagination.page}`;
    }

    const params: HttpParams = new HttpParams({
      fromString: string
    });

    return this.http
      .get<IResponse<IAccount.IData>>(`${this.url}/v10/account`, {
        params
      })
      .pipe(
        delay(500),
        map(res => res.response.data.accounts),
        catchError((error: any) => throwError(error))
      );
  }
}
