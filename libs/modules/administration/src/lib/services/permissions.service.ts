import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getPermissions(): Observable<string[]> {
    return this.http
      .get<IResponse<string[]>>(`${this.url}/v10/account/permission`)
      .pipe(
        delay(500),
        map((res: IResponse<string[]>) => res.response.data.permissions),
        catchError((error: any) => throwError(error))
      );
  }
}
