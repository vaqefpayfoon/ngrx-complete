import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IServices } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getServices(
    branchUuid: string,
    category?: string
  ): Observable<IServices.IDocument[]> {
    let string = `branchUuid=${branchUuid}`;

    if (category) {
      string += `&category=${category}`;
    }
    const params: HttpParams = new HttpParams({
      fromString: string
    });

    return this.http
      .get<IResponse<IServices.IDocument[]>>(`${this.url}/v10/service`, {
        params
      })
      .pipe(
        delay(500),
        map(res => res.response.data.services),
        catchError((error: any) => throwError(error))
      );
  }

  getService(uuid: string): Observable<IServices.IDocument> {
    return this.http
      .get<IResponse<IServices.IDocument>>(`${this.url}/v10/service/${uuid}`)
      .pipe(
        delay(500),
        map((res: IResponse<IServices.IDocument>) => res.response.data.service),
        catchError((error: any) => throwError(error))
      );
  }

  activateService(payload: IServices.IDocument) {
    return this.http
      .put(`${this.url}/v10/service/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateService(payload: IServices.IDocument) {
    return this.http
      .put(`${this.url}/v10/service/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  createService(service: IServices.ICreate): Observable<IServices.IDocument> {
    return this.http.post(`${this.url}/v10/service`, service).pipe(
      delay(500),
      map((res: IResponse<IServices.IDocument>) => res.response.data.service),
      catchError((error: any) => throwError(error))
    );
  }

  updateService(service: IServices.IDocument): Observable<IServices.IDocument> {
    const {
      title,
      subtitle,
      description,
      pricing,
      flatRateUnit,
      appointment,
      tax
    } = service;

    const updateDocument: IServices.IUpdate = {
      title,
      subtitle,
      description,
      pricing,
      appointment,
      flatRateUnit,
      tax
    };
    return this.http
      .put<IResponse<IServices.IDocument>>(
        `${this.url}/v10/service/${service.uuid}`,
        updateDocument
      )
      .pipe(
        delay(500),
        map(() => service),
        catchError((error: any) => throwError(error))
      );
  }
}
