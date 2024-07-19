import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IInsurer } from '../models';
import {
  IResponse,
  IGlobalFilter,
  IGlobalSort,
  IGlobalConfig,
  IGlobalData,
  IRequest,
  IBody,
} from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class InsurerService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getInsurers({
    corporateUuid,
    config,
    filters,
    sorts,
  }: {
    corporateUuid: string;
    config: IGlobalConfig;
    filters?: IGlobalSort;
    sorts?: IGlobalFilter;
  }): Observable<IGlobalData<IInsurer.IDocument>> {
    const httpParams = [];

    httpParams.push(`corporateUuid=${corporateUuid}`);

    let key: keyof IGlobalConfig;
    for (key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (config[key]) {
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
      .get<IResponse<IGlobalData<IInsurer.IDocument>>>(
        `${this.url}/v10/insurer`,
        {
          params,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.insurers),
        catchError((error: any) => throwError(error))
      );
  }

  activateInsurer({
    payload,
  }: IRequest<IInsurer.IDocument>): Observable<IInsurer.IDocument> {
    return this.http
      .put(`${this.url}/v10/insurer/${payload.uuid}/activate`, {})
      .pipe(
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateInsurer({
    payload,
  }: IRequest<IInsurer.IDocument>): Observable<IInsurer.IDocument> {
    return this.http
      .put(`${this.url}/v10/insurer/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deleteInsurer({ payload }: IRequest<IInsurer.IDocument>): Observable<IInsurer.IDocument> {
    return this.http.delete(`${this.url}/v10/insurer/${payload.uuid}`, {}).pipe(
      delay(500),
      map(() => payload),
      catchError((error: any) => throwError(error))
    );
  }

  createInsurer({
    payload,
  }: IRequest<IInsurer.ICreate>): Observable<IInsurer.IDocument> {
    return this.http
      .post<IResponse<IInsurer.IDocument>>(`${this.url}/v10/insurer`, payload)

      .pipe(
        map((res) => res.response.data.insurer),
        catchError((error: any) => throwError(error))
      );
  }

  updateInsurer(
    payload: IBody<IInsurer.IDocument, IInsurer.IUpdate>
  ): Observable<IInsurer.IDocument> {
    const { document, changes } = payload;

    return this.http
      .put<IResponse<IInsurer.IDocument>>(
        `${this.url}/v10/insurer/${document.uuid}`,
        changes
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.insurer),
        catchError((error: any) => throwError(error))
      );
  }
}
