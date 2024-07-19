import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IProductCoverages } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class ProductCoveragesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getProductCoverages(
    branchUuid: string,
    config: IProductCoverages.IConfig
  ): Observable<IProductCoverages.IData> {
    return this.http
      .get<IResponse<IProductCoverages.IData>>(
        `${this.url}/v10/product/coverage?limit=${config.limit}&page=${config.page}&branchUuid=${branchUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.productCoverages),
        catchError((error: any) => throwError(error))
      );
  }

  getProductCoverage(uuid: string): Observable<IProductCoverages.IDocument> {
    return this.http
      .get<IResponse<IProductCoverages.IDocument>>(
        `${this.url}/v10/product/coverage/${uuid}`
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<IProductCoverages.IDocument>) =>
            res.response.data.productCoverage
        ),
        catchError((error: any) => throwError(error))
      );
  }

  activateProductCoverage(payload: IProductCoverages.IDocument) {
    return this.http
      .put(`${this.url}/v10/product/coverage/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateProductCoverage(payload: IProductCoverages.IDocument) {
    return this.http
      .put(`${this.url}/v10/product/coverage/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deleteVehicleCoverage(
    corporateUuid: string,
    payload: IProductCoverages.IDocument
  ) {
    return this.http
      .delete(
        `${this.url}/v10/product/coverage/${payload.uuid}/delete?branchUuid=${payload.branchUuid}&corporateUuid=${corporateUuid}`,
        {}
      )
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  createProductCoverage(
    product: IProductCoverages.ICreate
  ): Observable<IProductCoverages.IDocument> {
    return this.http
      .post<IResponse<IProductCoverages.IDocument>>(
        `${this.url}/v10/product/coverage`,
        product
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<IProductCoverages.IDocument>) =>
            res.response.data.productCoverage
        ),
        catchError((error: any) => throwError(error))
      );
  }

  updateProductCoverage(
    product: IProductCoverages.IDocument
  ): Observable<IProductCoverages.IDocument> {
    const { partNumber, pricing, uuid } = product;

    const updateProduct: IProductCoverages.IUpdate = {
      partNumber,
      pricing,
    };

    return this.http
      .put<IResponse<IProductCoverages.IDocument>>(
        `${this.url}/v10/product/coverage/${uuid}`,
        updateProduct
      )
      .pipe(
        delay(500),
        map(() => product),
        catchError((error: any) => throwError(error))
      );
  }

  getProductBrands(serviceType: string): Observable<string[]> {
    return this.http
      .get<IResponse<string[]>>(
        `${this.url}/v10/product/brand?serviceType=${serviceType}`
      )
      .pipe(
        delay(500),
        map((res: IResponse<string[]>) => res.response.data.brands),
        catchError((error: any) => throwError(error))
      );
  }

  getProductModels(
    brand: string,
    serviceType: string
  ): Observable<IProductCoverages.IModel[]> {
    return this.http
      .get<IResponse<IProductCoverages.IModel[]>>(
        `${this.url}/v10/product/model?serviceType=${serviceType}&brand=${brand}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.object),
        catchError((error: any) => throwError(error))
      );
  }
}
