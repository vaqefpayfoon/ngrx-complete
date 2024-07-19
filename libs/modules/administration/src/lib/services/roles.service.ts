import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IRole } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getRoles(): Observable<IRole.IDocument[]> {
    return this.http
      .get<IResponse<IRole.IDocument[]>>(`${this.url}/v10/account/role`)
      .pipe(
        delay(500),
        map(res => res.response.data.accountRoles),
        catchError((error: any) => throwError(error))
      );
  }

  getRole(uuid: string): Observable<IRole.IDocument> {
    return this.http
      .get<IResponse<IRole.IDocument>>(
        `${this.url}/v10/account/role/${uuid}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.accountRole),
        catchError((error: any) => throwError(error))
      );
  }

  createRole(
    role: IRole.IDocument,
    isSuperAdmin?: boolean
  ): Observable<IRole.IDocument> {
    if (!isSuperAdmin) {
      delete role.isSuperAdminRole;
    }

    return this.http
      .post<IResponse<IRole.IDocument>>(`${this.url}/v10/account/role`, role)
      .pipe(
        delay(500),
        map((res: IResponse<{ uuid: string }>) =>
          Object.assign({ uuid: res.response.data.accountRole.uuid }, role)
        ),
        catchError((error: any) => throwError(error))
      );
  }

  updateRole(
    role: IRole.IDocument,
    isSuperAdmin?: boolean
  ): Observable<IRole.IDocument> {
    const { isSuperAdminRole, isVisible } = role;

    const UpdateDocument: IRole.IUpdate = {
      permissions: role.permissions.map(perm => perm),
      isSuperAdminRole,
      isVisible
    };

    if (!isSuperAdmin) {
      delete UpdateDocument.isSuperAdminRole;
    }

    return this.http
      .put<IResponse<IRole.IDocument>>(
        `${this.url}/v10/account/role/${role.uuid}`,
        UpdateDocument
      )
      .pipe(
        delay(500),
        map((res: IResponse<IRole.IDocument>) => role),
        catchError((error: any) => throwError(error))
      );
  }

  deleteRole(role: IRole.IDocument): Observable<IRole.IDocument> {
    return this.http
      .delete<IRole.IDocument>(`${this.url}/v10/account/role/${role.uuid}`)
      .pipe(
        delay(500),
        map(() => role),
        catchError((error: any) => throwError(error))
      );
  }
}
