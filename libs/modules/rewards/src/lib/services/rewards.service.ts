import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IPromotions } from '../models';
import { IError, IResponse } from '@neural/shared/data';
import { Auth } from '@neural/auth';
import { IVehicle } from '@neural/modules/customer/vehicles';

@Injectable({
  providedIn: 'root',
})
export class RewardsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getPromotions(
    config: IPromotions.IConfig,
    filters?: IPromotions.IFilter,
    sorts?: IPromotions.ISort
  ): Observable<IPromotions.IData> {
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
      .get<IResponse<IPromotions.IData>>(`${this.url}/v10/promo`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.promos),
        catchError((error: any) => throwError(error))
      );
  }

  createPromotions(
    promo: IPromotions.ICreate
  ): Observable<IPromotions.IDocument> {
    return this.http
      .post<IResponse<IPromotions.IDocument>>(`${this.url}/v10/promo`, promo)

      .pipe(
        map((res: IResponse<IPromotions.IDocument>) => res.response.data.promo),
        catchError((error: any) => throwError(error))
      );
  }

  updatePromotions(
    promo: IPromotions.IDocument
  ): Observable<IPromotions.IDocument> {
    const {
      ['uuid']: uuid,
      ['corporateUuid']: corporateUuid,
      ['active']: active,
      ...rest
    } = promo;

    return this.http
      .put<IResponse<IPromotions.IDocument>>(
        `${this.url}/v10/promo/${promo.uuid}`,
        rest
      )

      .pipe(
        delay(500),
        map(() => promo),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  activatePromotion(payload: IPromotions.IDocument) {
    return this.http
      .put(`${this.url}/v10/promo/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivatePromotion(payload: IPromotions.IDocument) {
    return this.http
      .put(`${this.url}/v10/promo/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  getPromotion(uuid: string): Observable<IPromotions.IDocument> {
    return this.http
      .get<IResponse<IPromotions.IDocument>>(`${this.url}/v10/promo/${uuid}`)

      .pipe(
        delay(500),
        map(
          (res: IResponse<IPromotions.IDocument>) => res?.response?.data?.promo
        ),
        catchError((error: any) => throwError(error))
      );
  }

  validatePromotionCode({
    promo,
    corporateUuid,
  }: {
    promo: string;
    corporateUuid: string;
  }): Observable<string> {
    return this.http
      .get<IResponse<string>>(
        `${this.url}/v10/promo/validate/${promo}?corporateUuid=${corporateUuid}`
      )

      .pipe(
        map((res: IResponse<string>) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  getAccountByEmail(email: string): Observable<Auth.IAccount> {
    return this.http
      .get<IResponse<Auth.IAccount>>(
        `${this.url}/v10/account/email?email=${email}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.account),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleReferenceBrandModelList(
    corporateUuid: string
  ): Observable<IPromotions.IBrand[]> {
    return this.http
      .get<IResponse<IPromotions.IBrand[]>>(
        `${this.url}/v10/vehicle/reference/brand-models?corporateUuid=${corporateUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.brands),
        catchError((error: any) => throwError(error))
      );
  }

  getAccounts(
    config: IPromotions.IConfig,
    filters: IPromotions.IFilter
  ): Observable<IPromotions.IAccountData> {
    const httpParams = [];

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (filters[key]) {
          httpParams.push([`filter[${key}]=${filters[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IPromotions.IAccountData>>(
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
    filter: IPromotions.IFilter,
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
