import { Inject, Injectable, SkipSelf } from '@angular/core';

// Environment
import { Environment, ENVIRONMENT } from '@neural/environment';

// response
import { IResponse } from '@neural/shared/data';

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

// object-to-formdata
import { serialize } from 'object-to-formdata';

// Interfaces
import { IUpload } from '../models';

// Http clients
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

import { options } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  url = `${this.env.api.community}`;

  constructor(
    @SkipSelf() private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment,
  ) {}

  uploadAttachment(object: IUpload.IUploadImage): Observable<any> {
    const formData = serialize(object, options);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<any>>(
        `${this.url}/v10/common/upload-attachment`,
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
}
