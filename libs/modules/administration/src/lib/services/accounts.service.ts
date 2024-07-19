import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IAccount, ISalesAdvisor } from '../models';
import { IResponse } from '@neural/shared/data';
import { ICorporates } from '@neural/modules/customer/corporate';

import { options } from '@neural/shared/data';

import { serialize } from 'object-to-formdata';
import { flattenObject } from '../functions';

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getAccounts(
    config: IAccount.IConfig,
    corporateUuid: string
  ): Observable<IAccount.IData> {
    let string = `limit=${config.limit}&page=${config.page}&corporateUuid=${corporateUuid}`;

    // if (config && config.filter) {
    //   const key = Object.keys(config.filter)[0];

    //   string += `&filter[${key}]=${config.filter[key]}`;
    // }

    for (const key in flattenObject(config.filter)) {
      if (Object.prototype.hasOwnProperty.call(flattenObject(config.filter), key)) {
        if (!!flattenObject(config.filter)[key]) {
          string += `&filter[${key}]=${flattenObject(config.filter)[key]}`;
        }
      }
    }

    if (config && config.sort) {
      const key = Object.keys(config.sort)[0].toString();
      const value = config.sort[key];

      string += `&sort[${key.toLowerCase()}]=${value}`;
    }
    
    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<IAccount.IData>>(`${this.url}/v11/account/nerv`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.accounts),
        catchError((error: any) => throwError(error))
      );
  }

  getCustomerAccounts(
    config: IAccount.IConfig,
    corporateUuid: string,
    filters: IAccount.IFilter
  ): Observable<IAccount.IData> {
    const httpParams = [];

    httpParams.push(`corporateUuid=${corporateUuid}`);

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
      .get<IResponse<IAccount.IData>>(`${this.url}/v11/account/customer`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.accounts),
        catchError((error: any) => throwError(error))
      );
  }

  getOperationAccounts(
    config: IAccount.IConfig,
    corporateUuid: string
  ): Observable<IAccount.IData> {
    let string = `limit=${config.limit}&page=${config.page}&corporateUuid=${corporateUuid}`;

    if (config && config.filter) {
      const key = Object.keys(config.filter)[0];

      string += `&filter[${key}]=${config.filter[key]}`;
    }

    if (config && config.sort) {
      const key = Object.keys(config.sort)[0].toString();
      const value = config.sort[key];

      string += `&sort[${key.toLowerCase()}]=${value}`;
    }
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

  getSalesAdvisor({
    corporateUuid,
    branchUuid,
    brand,
  }: {
    corporateUuid: string;
    branchUuid: string;
    brand?: string;
  }): Observable<ISalesAdvisor.ISADocument[]> {
    let string = `corporateUuid=${corporateUuid}&branchUuid=${branchUuid}`;

    if (brand) {
      string += `&brand=${brand}`;
    }

    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<{
        response: { message: string; data: ISalesAdvisor.ISADocument[] };
      }>(`${this.url}/v10/account/sales-advisor-nerv`, {
        params,
      })
      .pipe(
        map((res) => res.response.data),
        catchError((error) => throwError(error))
      );
  }

  getCorporate(uuid: string): Observable<ICorporates.IDocument> {
    return this.http
      .get<IResponse<ICorporates.IDocument>>(
        `${this.url}/v10/corporate/${uuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.corporate),
        catchError((error: any) => throwError(error))
      );
  }

  getAccountByEmail(email: string): Observable<IAccount.IDocument> {
    return this.http
      .get<IResponse<IAccount.IDocument>>(
        `${this.url}/v10/account/email?email=${email}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.account),
        catchError((error: any) => throwError(error))
      );
  }

  getAccount(uuid: string): Observable<IAccount.IDocument> {
    return this.http
      .get<IResponse<IAccount.IDocument>>(`${this.url}/v10/account/${uuid}`)
      .pipe(
        delay(500),
        map((res) => res.response.data.account),
        catchError((error: any) => throwError(error))
      );
  }

  activateAccount(payload: IAccount.IDocument) {
    return this.http
      .put(`${this.url}/v10/account/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateAccount(payload: IAccount.IDocument) {
    return this.http
      .put(`${this.url}/v10/account/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  getSelfBranches(): Observable<IAccount.IBranch[]> {
    return this.http
      .get<IResponse<IAccount.IBranch[]>>(`${this.url}/v10/branch/self`)
      .pipe(
        delay(500),
        map((res) => res.response.data.branches),
        catchError((error: any) => throwError(error))
      );
  }

  createAccount(account: IAccount.ICreate): Observable<IAccount.IDocument> {
    return this.http
      .post<IResponse<IAccount.IDocument>>(`${this.url}/v11/account`, account)

      .pipe(
        delay(500),
        map((res: IResponse<IAccount.IDocument>) => res.response.data.account),
        catchError((error: any) => throwError(error))
      );
  }

  updateAccount(account: IAccount.IDocument): Observable<IAccount.IDocument> {
    const {
      identity,
      document,
      permissions,
      products,
      corporate,
      phone,
      uuid,
      email,
      dateOfBirth,
      drivingLicenseExpiry,
      cso,
      integrations
    } = account;

    const updateDocument: IAccount.IUpdate = {
      identity,
      document,
      phone,
      products,
      corporate,
      permissions,
      email,
      dateOfBirth,
      drivingLicenseExpiry,
      cso,
      integrations
    };

    return this.http
      .put<IResponse<IAccount.IUpdate>>(
        `${this.url}/v12/account/${uuid}/profile`,
        updateDocument
      )

      .pipe(
        delay(500),
        map(() => account),
        catchError((error: any) => throwError(error))
      );
  }

  updateAccountPassword(
    account: IAccount.IUpdatePass
  ): Observable<IAccount.IDocument> {
    const { password, uuid } = account;
    return this.http
      .put<IResponse<IAccount.IUpdatePass>>(
        `${this.url}/v10/account/${uuid}/password`,
        { password }
      )

      .pipe(
        delay(500),
        map(() => account),
        catchError((error: any) => throwError(error))
      );
  }

  deleteAccount(payload: IAccount.IDocument): Observable<IAccount.IDocument> {
    return this.http
      .delete<IResponse<IAccount.IDocument>>(
        `${this.url}/v10/account/purge/${payload.uuid}`
      )

      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  resyncAccount(payload: IAccount.IDocument): Observable<IAccount.IDocument> {
    const { uuid } = payload;

    return this.http
      .put<IResponse<IAccount.IDocument>>(
        `${this.url}/v11/account/resync/${uuid}`,
        {}
      )

      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  resyncFirebase(payload: IAccount.IDocument): Observable<IAccount.IDocument> {
    const { uuid } = payload;

    return this.http
      .put<IResponse<IAccount.IDocument>>(
        `${this.url}/v10/account/${uuid}/resync-auth`,
        {}
      )

      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  importExcelAccounts(
    object: IAccount.ISynchronization,
    uuid: string
  ): Observable<any> {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    const formData = serialize(object, options);

    return this.http
      .put(
        `${this.url}/v10/account/import/excel?corporateUuid=${uuid}`,
        formData,
        {
          headers,
        }
      )

      .pipe(
        delay(500),
        map((res: any) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  // todo: dulicated remove later
  getGlobalVehicleBrands(): Observable<string[]> {
    return this.http.get(`${this.url}/v10/vehicle/global/brand`).pipe(
      delay(500),
      map((res: any) => res.response.data.brands),
      catchError((error: any) => throwError(error))
    );
  }
}
