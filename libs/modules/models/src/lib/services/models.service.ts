import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IModels } from '../models';
import { IResponse } from '@neural/shared/data';

// Interceptors
const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getModels(
    config: IModels.IConfig,
    corporateUuid: string
  ): Observable<IModels.IData> {
    const string = `limit=${config.limit}&page=${config.page}&filter[corporateUuid]=${corporateUuid}`;

    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<IModels.IData>>(`${this.url}/v10/model`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.models),
        catchError((error: any) => throwError(error))
      );
  }

  createModel(model: IModels.ICreate): Observable<IModels.IDocument> {
    return this.http
      .post<IResponse<IModels.IDocument>>(`${this.url}/v10/model`, model)

      .pipe(
        map((res: IResponse<IModels.IDocument>) => res.response.data.model),
        catchError((error: any) => throwError(error))
      );
  }

  updateModel(model: IModels.IDocument): Observable<IModels.IDocument> {
    const {
      ['uuid']: uuid,
      ['corporateUuid']: corporateUuid,
      ['active']: active,
      ...rest
    } = model;

    return this.http
      .put<IResponse<IModels.IUpdate>>(`${this.url}/v10/model/${uuid}`, rest)

      .pipe(
        map(() => model),
        catchError((error: any) => throwError(error))
      );
  }

  activateModel(payload: IModels.IDocument) {
    return this.http
      .put(`${this.url}/v10/model/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateModel(payload: IModels.IDocument) {
    return this.http
      .put(`${this.url}/v10/model/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  uploadGalleryImage(model: IModels.IFile): Observable<string> {
    const formData: any = new FormData();

    formData.append('image', model.file);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .put<IResponse<string>>(
        `${this.url}/v10/model/gallery/image?uuid=${model.uuid}&corporateUuid=${model.corporateUuid}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.image),
        catchError((error: any) => throwError(error))
      );
  }

  setBranches(
    payload: IModels.ISetBranches,
    model?: IModels.IDocument
  ): Observable<IModels.IDocument> {
    const { branches } = payload;
    return this.http
      .put<IResponse<IModels.IDocument>>(
        `${this.url}/v10/model/set-branches`,
        payload
      )
      .pipe(
        delay(500),
        map(() => {
          return {
            ...model,
            branches,
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  listBrandsAndSeries(corporateUuid: string): Observable<IModels.IBrand[]> {
    return this.http
      .get<IModels.IBrand[]>(
        `${this.url}/v10/model/brands-series?corporateUuid=${corporateUuid}`
      )
      .pipe(
        delay(500),
        map((res: any) => res.response.data.brands),
        catchError((error: any) => throwError(error))
      );
  }
  // `${this.url}/v10/model/admin/series-actual-models?corporateUuid=${corporateUuid}&brand=${brand}&series=${series}`

  listSeriesModels(
    corporateUuid: string,
    brand: string,
    series: string
  ): Observable<IModels.ISeries> {
    return this.http
      .get<IModels.ISeries>(
        `${this.url}/v10/model/admin/series-actual-models?corporateUuid=${corporateUuid}&brand=${brand}&series=${series}`
      )
      .pipe(
        delay(500),
        map((res: any) => res.response.data.series),
        catchError((error: any) => throwError(error))
      );
  }

  listVariants(payload: IModels.IVariant): Observable<IModels.IDocument[]> {
    const { corporateUuid, brand, series, model } = payload;
    return this.http
      .get<IModels.IDocument[]>(
        `${this.url}/v10/model/variants-nerv?corporateUuid=${corporateUuid}&brand=${brand}&series=${series}&model=${model}`
      )
      .pipe(
        delay(500),
        map((res: any) => res.response.data.variants),
        catchError((error: any) => throwError(error))
      );
  }

  uploadSeriesImage(model: IModels.ISetSeriesImage): Observable<string> {
    const { image, brand, series, corporateUuid } = model;

    const formData: any = new FormData();

    formData.append('image', image);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .put<IResponse<string>>(
        `${this.url}/v10/model/series/image?corporateUuid=${corporateUuid}&brand=${brand}&series=${series}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.image),
        catchError((error: any) => throwError(error))
      );
  }

  getModel(
    payload: string,
    corporateUuid: string
  ): Observable<IModels.IDocument | any> {
    return this.http
      .get<IResponse<IModels.IDocument>>(
        `${this.url}/v10/model/${payload}?corporateUuid=${corporateUuid}`
      )
      .pipe(
        delay(500),
        map((res: any) => res.response.data.model),
        catchError((error: any) => throwError(error))
      );
  }

  getModelImage(
    payload?: IModels.IDocument,
    payload2?: IModels.IVariant
  ): Observable<IModels.IDocument | any> {
    let getDocument: IModels.IVariant;

    if (payload) {
      getDocument = {
        corporateUuid: payload.corporateUuid,
        brand: payload.unit.brand,
        series: payload.unit.series,
        model: payload.unit.actualModel ? payload.unit.actualModel : null,
      };
    }

    if (payload2) {
      getDocument = {
        corporateUuid: payload2.corporateUuid,
        brand: payload2.brand,
        model: payload2.model,
        series: payload.unit.series,
      };
    }

    return this.http
      .get<IResponse<IModels.IDocument>>(
        `${this.url}/v10/model/model-image?corporateUuid=${getDocument.corporateUuid}&brand=${getDocument.brand}&model=${getDocument.model}`
      )
      .pipe(
        delay(500),
        map((res: any) => {
          if (!!payload) {
            return {
              ...payload,
              image: res.response.data.image,
            };
          }
          return res.response.data.image;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  getSeriesImage(payload: IModels.IDocument): Observable<IModels.IDocument> {
    const {
      corporateUuid,
      unit: { brand, series },
    } = payload;

    return this.http
      .get<IResponse<IModels.IDocument>>(
        `${this.url}/v10/model/series/image?corporateUuid=${corporateUuid}&brand=${brand}&series=${series}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.image),
        catchError((error: any) => throwError(error))
      );
  }

  setModelImage(payload: IModels.ISetModelImage): Observable<string> {
    return this.http
      .put<IResponse<string>>(`${this.url}/v10/model/model-image`, payload)
      .pipe(
        delay(500),
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  deleteGalleryImage({
    uuid,
    image,
    corporateUuid,
  }: {
    uuid: string;
    image: string;
    corporateUuid: string;
  }): Observable<string> {
    return this.http
      .delete<IResponse<string>>(
        `${this.url}/model/gallery/image?uuid=${uuid}&image=${image}&corporateUuid=${corporateUuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }
}
