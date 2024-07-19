import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IApps } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class AppsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  listCorporateApps(config: IApps.IConfig): Observable<IApps.IDocument[]> {
    const string = `corporateUuid=${config.corporateUuid}`;

    const params: HttpParams = new HttpParams({
      fromString: string
    });

    return this.http
      .get<IResponse<IApps.IDocument[]>>(`${this.url}/v10/corporate/app/self`, {
        params
      })
      .pipe(
        delay(500),
        map(res => res.response.data.corporateApps),
        catchError((error: any) => throwError(error))
      );
  }

  createCorporateApp(
    corporate: IApps.ICreate
  ): Observable<IApps.ICreateResponse> {
    return this.http.post(`${this.url}/v10/corporate/app`, corporate).pipe(
      delay(500),
      map((res: any) => {
        return res.response.data;
      }),
      catchError((error: any) => throwError(error))
    );
  }

  updateCorporateApp(
    corporateApp: IApps.IDocument
  ): Observable<IApps.IDocument> {
    const { name, payload, uuid } = corporateApp;

    const app: IApps.IUpdate = {
      name,
      payload
    };

    return this.http.put(`${this.url}/v10/corporate/app/${uuid}`, app).pipe(
      delay(500),
      map((res: IApps.IDocument) => corporateApp),
      catchError((error: any) => throwError(error))
    );
  }

  getApp(appUuid: string): Observable<IApps.IDocument> {
    return this.http
      .get<IResponse<IApps.IDocument>>(
        `${this.url}/v10/corporate/app/${appUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.corporateApp),
        catchError((error: any) => throwError(error))
      );
  }

  activateCorporateApp(payload: IApps.IDocument) {
    return this.http
      .put(`${this.url}/v10/corporate/app/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateCorporateApp(payload: IApps.IDocument) {
    return this.http
      .put(`${this.url}/v10/corporate/app/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  getCorporateApp(corporateApp: IApps.IDocument): Observable<IApps.IDocument> {
    return this.http
      .get(`${this.url}/v10/corporate/app/${corporateApp.uuid}`)
      .pipe(
        delay(500),
        map(
          (res: IResponse<IApps.IDocument>) =>
            res.response.data.corporateAppDocument
        ),
        catchError((error: any) => throwError(error))
      );
  }

  regenerateCorporateAppToken(
    corporateApp: IApps.IDocument
  ): Observable<string> {
    const { uuid } = corporateApp;

    return this.http
      .get<IResponse<string>>(
        `${this.url}/v10/corporate/app/${uuid}/regenerate-token`
      )
      .pipe(
        delay(500),
        map((res: IResponse<string>) => res.response.data.appKey),
        catchError((error: any) => throwError(error))
      );
  }
}
