import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IBranchTeams } from '../models';

import { Auth } from '@neural/auth';

@Injectable({
  providedIn: 'root'
})
export class BranchTeamService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getBranchTeam(branchUuid: string): Observable<IBranchTeams.IDocument> {
    return this.http
      .get<{ response: { message: string; data: IBranchTeams.IDocument } }>(
        `${this.url}/v10/branch/team/${branchUuid}?filter[permissions.operationRole]=${Auth.OperationRole.CSO}&filter[permissions.operationRole]=${Auth.OperationRole.SERVICE_ADVISOR}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }
}
