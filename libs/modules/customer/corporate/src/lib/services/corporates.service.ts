import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay, filter } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ICorporates } from '../models';
import { IResponse } from '@neural/shared/data';
import { Auth } from '@neural/auth';

// Interceptors
const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class CorporatesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getCorporates(config: ICorporates.IConfig): Observable<ICorporates.IData> {
    return this.http
      .get<IResponse<ICorporates.IData>>(
        `${this.url}/v10/corporate?limit=${config.limit}&page=${config.page}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.corporates),
        catchError((error: any) => throwError(error))
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

  activateCorporate(payload: ICorporates.IDocument) {
    return this.http
      .put(`${this.url}/v10/corporate/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateCorporate(payload: ICorporates.IDocument) {
    return this.http
      .put(`${this.url}/v10/corporate/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  createCorporate(
    corporate: ICorporates.ICreate
  ): Observable<ICorporates.IDocument> {
    return this.http.post(`${this.url}/v10/corporate`, corporate).pipe(
      delay(500),
      map(
        (res: IResponse<ICorporates.IDocument>) => res.response.data.corporate
      ),
      catchError((error: any) => throwError(error))
    );
  }

  updateCorporate(
    corporate: ICorporates.IDocument
  ): Observable<ICorporates.IDocument> {
    const updateDocument: ICorporates.IUpdate = {
      name: corporate.name,
      description: corporate.description,
      peopleInCharge: corporate.peopleInCharge.map((incharge) => incharge),
      registrationNumber: corporate.registrationNumber,
      type: corporate.type,
      appIdentifiers: corporate.appIdentifiers,
      socialAccounts: corporate.socialAccounts,
      configuration: corporate.configuration,
    };
    return this.http
      .put<IResponse<{}>>(
        `${this.url}/v10/corporate/${corporate.uuid}`,
        updateDocument
      )
      .pipe(
        delay(500),
        map(() => corporate),
        catchError((error: any) => throwError(error))
      );
  }

  updateCorporateImage(
    corporate: ICorporates.IDocument
  ): Observable<ICorporates.IDocument> {
    const formData: any = new FormData();

    formData.append('image', corporate.file);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .put<IResponse<ICorporates.IDocument>>(
        `${this.url}/v10/corporate/${corporate.uuid}/image`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map(() => {
          const extention = /[.]/.exec(corporate.file.name)
            ? /[^.]+$/.exec(corporate.file.name)
            : undefined;

          return {
            ...corporate,
            image: `${this.env.s3.corporate}/${corporate.uuid}.${extention}`,
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  uploadSocialIcon(
    file: any,
    payload: ICorporates.IDocument
  ): Observable<string> {
    const { uuid } = payload;

    const formData: any = new FormData();

    formData.append('image', file);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<string>>(
        `${this.url}/v10/corporate/icon/${uuid}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.icon),
        catchError((error: any) => throwError(error))
      );
  }

  uploadAppImage(payload: ICorporates.IAppImageUpload): Observable<string> {
    const formData: any = new FormData();

    formData.append('corporateUuid', payload.corporateUuid);
    formData.append('image', payload.file);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<string>>(
        `${this.url}/v10/common/upload-app-image`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.url),
        catchError((error: any) => throwError(error))
      );
  }

  uploadWatermark(payload: ICorporates.IAppImageUpload): Observable<string> {
    const formData: any = new FormData();

    formData.append('corporateUuid', payload.corporateUuid);
    formData.append('image', payload.file);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<string>>(
        `${this.url}/v10/corporate/upload-watermark`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.url),
        catchError((error: any) => throwError(error))
      );
  }

  getOperationAccounts(
    corporateUuid: string,
    config: ICorporates.IConfig
  ): Observable<ICorporates.IOperationData> {
    const string = `limit=${config.limit}&page=${config.page}&corporateUuid=${corporateUuid}&filter[permissions.operationRole]=${Auth.OperationRole.CSO}&filter[permissions.operationRole]=${Auth.OperationRole.SERVICE_ADVISOR}`;

    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<ICorporates.IOperationData>>(
        `${this.url}/v11/account/operation`,
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
}
