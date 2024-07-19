import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IAgreements } from '../models';
import { IResponse, options } from '@neural/shared/data';

// Interceptors
import { InterceptorSkipHeader } from './branches.service';
import { serialize } from 'object-to-formdata';

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  listAgreements(
    config: IAgreements.IConfig
  ): Observable<IAgreements.IDocument[]> {
    const string = `corporateUuid=${config.corporateUuid}`;

    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<IAgreements.IDocument[]>>(`${this.url}/v11/agreement`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.agreements),
        catchError((error: any) => throwError(error))
      );
  }

  createAgreement(
    object: IAgreements.ICreate
  ): Observable<IAgreements.IDocument> {
    return this.http
      .post<IResponse<IAgreements.IDocument>>(
        `${this.url}/v11/agreement`,
        object
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.agreement),
        catchError((error: any) => throwError(error))
      );
  }

  updateAgreement(
    payload: IAgreements.IDocument
  ): Observable<IAgreements.IDocument> {
    const {
      ['uuid']: uuid,
      ['type']: type,
      ['pdfUrl']: pdfUrl,
      ...object
    } = payload;

    return this.http
      .put<IResponse<IAgreements.IDocument>>(
        `${this.url}/v11/agreement/${uuid}`,
        object
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.agreement),
        catchError((error: any) => throwError(error))
      );
  }

  uploadAgreementDocument(
    payload: IAgreements.IUploadFile
  ): Observable<IAgreements.IDocument> {
    const formData = serialize(payload, options);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<IAgreements.IDocument>>(
        `${this.url}/v10/agreement/upload-document`,
        formData,
        { headers }
      )
      .pipe(
        delay(500),
        map((res: IResponse<IAgreements.IDocument>) => res.response.data.url),
        catchError((error: any) => throwError(error))
      );
  }
}
