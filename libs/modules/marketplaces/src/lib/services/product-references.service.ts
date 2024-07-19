import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IProductReferences } from '../models';
import { IResponse } from '@neural/shared/data';

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

import { options } from '@neural/shared/data';

import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root'
})
export class ProductReferencesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment,
  ) {}

  getProductReferences(
    config: IProductReferences.IConfig
  ): Observable<IProductReferences.IData> {
    return this.http
      .get<IResponse<IProductReferences.IData>>(
        `${this.url}/v10/product/reference?limit=${config.limit}&page=${
          config.page
        }`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.productReferences),
        catchError((error: any) => throwError(error))
      );
  }

  getProductReference(uuid: string): Observable<IProductReferences.IDocument> {
    return this.http
      .get<IResponse<IProductReferences.IDocument>>(`${this.url}/v10/product/reference/${uuid}`)
      .pipe(
        delay(500),
        map(
          (res: IResponse<IProductReferences.IDocument>) => res?.response?.data?.productReference
        ),
        catchError((error: any) => throwError(error))
      );
  }

  activateProductReference(payload: IProductReferences.IDocument) {
    return this.http
      .put(`${this.url}/v10/product/reference/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateProductReference(payload: IProductReferences.IDocument) {
    return this.http
      .put(`${this.url}/v10/product/reference/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  createProductReference(
    product: IProductReferences.ICreate,
  ): Observable<IProductReferences.IDocument> {

    const formData = serialize(product, options);

    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')

    return this.http
      .post(`${this.url}/v10/product/reference`, formData, {
        headers
      })
      .pipe(
        delay(500),
        map(
          (res: IResponse<IProductReferences.IDocument>) =>
            res.response.data.productReference
        ),
        catchError((error: any) => throwError(error))
      );
  }

  updateProductReference(
    product: IProductReferences.IDocument,
  ): Observable<IProductReferences.IDocument> {
    const { uuid } = product;

    const formData = serialize(product, options);
    
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')

    return this.http
      .put(`${this.url}/v10/product/reference/${uuid}`, formData, {
        headers
      })
      .pipe(
        delay(500),
        map(() => product),
        catchError((error: any) => throwError(error))
      );
  }
}
