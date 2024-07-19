import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IGroup } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getGroups(corporateUuid: string): Observable<IGroup.IDocument[]> {
    return this.http
      .get<IResponse<IGroup.IDocument[]>>(
        `${this.url}/v10/account/group/brief/?corporateUuid=${corporateUuid}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.accountGroups),
        catchError((error: any) => throwError(error))
      );
  }

  getGroup(uuid: string, corporateUuid: string): Observable<IGroup.IDocument> {
    return this.http
      .get<IResponse<IGroup.IDocument>>(`${this.url}/v10/account/group/${uuid}?corporateUuid=${corporateUuid}`)
      .pipe(
        delay(500),
        map(
          (res: IResponse<IGroup.IDocument>) => res?.response?.data?.accountGroup
        ),
        catchError((error: any) => throwError(error))
      );
  }

  createGroup(
    corporateUuid: string,
    group: IGroup.IDocument
  ): Observable<IGroup.IDocument> {
    const createDocument: IGroup.ICreate = {
      name: group.name,
      roleUuids: group.roleUuids,
      corporateUuid
    };

    return this.http
      .post<IResponse<{ uuid: string }>>(
        `${this.url}/v10/account/group`,
        createDocument
      )
      .pipe(
        delay(500),
        map((res: IResponse<{ uuid: string }>) =>
          Object.assign({ uuid: res.response.data.accountGroup.uuid }, group)
        ),
        catchError((error: any) => throwError(error))
      );
  }

  updateGroup(
    corporateUuid: string,
    group: IGroup.IDocument
  ): Observable<IGroup.IDocument> {
    const filteredGroup = group.roleUuids.reduce((acc, current) => {
      const x = acc.find(item => item === current);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    const updateDocument: IGroup.IUpdate = {
      roleUuids: filteredGroup
    };

    return this.http
      .put<IResponse<{}>>(
        `${this.url}/v10/account/group/${
          group.uuid
        }?corporateUuid=${corporateUuid}`,
        updateDocument
      )
      .pipe(
        delay(500),
        map(() => group),
        catchError((error: any) => throwError(error))
      );
  }

  deleteGroup(
    group: IGroup.IDocument,
    corporateUuid: string
  ): Observable<IGroup.IDocument> {
    return this.http
      .delete<IGroup.IDocument>(
        `${this.url}/v10/account/group/${
          group.uuid
        }?corporateUuid=${corporateUuid}`
      )
      .pipe(
        delay(500),
        map(() => group),
        catchError((error: any) => throwError(error))
      );
  }
}
