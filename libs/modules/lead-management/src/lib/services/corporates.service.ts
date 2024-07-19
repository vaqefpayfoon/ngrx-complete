import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ICorporates } from '../models';
import { IResponse } from '@neural/shared/data';

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
}
