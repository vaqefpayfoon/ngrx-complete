import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// RxJs & Operators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ICampaigns } from '../../models';
import { IResponse, createFormData } from '@neural/shared/data';

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getCampaigns(
    config: ICampaigns.IConfig,
    corporateUuid: string
  ): Observable<ICampaigns.IData> {

    const { limit, page, _id,createdAt, ...rest } = config;

    const httpParams = [];
    httpParams.push(
      `limit=${limit}&page=${page}&filter[corporateUuid]=${corporateUuid}&sort[createdAt]=${
        createdAt ? createdAt : -1
      }`
    );

    for (const key in rest) {
      if (Object.prototype.hasOwnProperty.call(rest, key)) {
        if (rest[key]) {
          httpParams.push(`filter[${key}]=${rest[key]}`);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<ICampaigns.IData>>(`${this.url}/v10/campaign`, { params })
      .pipe(
        delay(500),
        map((res) => res.response.data.campaigns),
        catchError((error: any) => throwError(error))
      );
  }

  getCampaign(uuid: string): Observable<ICampaigns.IDocument> {
    return this.http
      .get<IResponse<ICampaigns.IDocument>>(`${this.url}/v10/campaign/${uuid}`)
      .pipe(
        delay(500),
        map((res) => res.response.data.campaign),
        catchError((error: any) => throwError(error))
      );
  }

  activateCampaign(payload: ICampaigns.IDocument) {
    return this.http
      .put(`${this.url}/v10/campaign/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateCampaign(payload: ICampaigns.IDocument) {
    return this.http
      .put(`${this.url}/v10/campaign/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  sendCampaignPushNotification(
    payload: ICampaigns.IDocument
  ): Observable<string> {
    return this.http
      .get<IResponse<string>>(`${this.url}/v10/campaign/push/${payload.uuid}`)
      .pipe(
        delay(500),
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  createCampaign(
    payload: ICampaigns.ICreate
  ): Observable<ICampaigns.IDocument> {
    const formData = createFormData(payload);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<ICampaigns.IDocument>>(
        `${this.url}/v10/campaign`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.campaign),
        catchError((error: any) => throwError(error))
      );
  }

  onFeatureCampaign(payload: ICampaigns.IDocument) {
    return this.http
      .put(`${this.url}/v10/campaign/${payload.uuid}/is-featured/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  offFeatureCampaign(payload: ICampaigns.IDocument) {
    return this.http
      .put(`${this.url}/v10/campaign/${payload.uuid}/is-featured/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  updateCampaign(
    payload: ICampaigns.IDocument
  ): Observable<ICampaigns.IDocument> {
    const {
      ['active']: active,
      ['uuid']: uuid,
      ['corporateUuid']: corporateUuid,
      ['notification']: notification,
      ['targetUuid']: targetUuid,
      ...rest
    } = payload;

    const restaa={
      notification,
      ...rest,
    }

    const formData = createFormData(restaa);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .put<IResponse<ICampaigns.IDocument>>(
        `${this.url}/v10/campaign/${uuid}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }
}
