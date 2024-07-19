import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

// Firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

// Environment
import { Environment, ENVIRONMENT } from '@neural/environment';

// Interface
import { Auth } from '../models';

// RxJs
import { Observable, throwError, from, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Login-Interceptor';

// Permission Tags
import { permissionTags, IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = `${this.env.api.community}`;

  constructor(
    @Inject(ENVIRONMENT) private readonly env: Environment,
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private angularFireDb: AngularFireDatabase,
    private angularFs: AngularFirestore
  ) {}

  login(payload: Auth.Login): Observable<Auth.Account> {
    const { token, email, password } = payload;

    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')
      .set('Authorization', `Bearer ${token}`);

    const params: HttpParams = new HttpParams({
      fromObject: {
        email,
        password,
      },
    });

    return this.http
      .get<{ response: { message: string; data: Auth.Account } }>(
        `${this.url}/v10/account/nerv/auth/password`,
        {
          params,
          headers,
        }
      )
      .pipe(
        map((res) => res.response.data),
        catchError((error) => throwError(error))
      );
  }

  signInAnonymously() {
    return from(this.angularFireAuth.signInAnonymously());
  }

  loginFirebase(token) {
    return from(this.angularFireAuth.signInWithCustomToken(token));
  }

  decodeToken(token: string) {
    if (token) {
      const helper = new JwtHelperService();
      return helper.decodeToken(token);
    }

    return null;
  }

  getTimeZoneByBranch(branchUuid: string): Observable<string> {
    return this.angularFs
      .collection('branches')
      .doc(branchUuid)
      .valueChanges()
      .pipe(
        delay(500),
        map((res: Auth.ISelectedBranch) => {
          if (!!res) {
            return res?.location?.timezone;
          } else {
            throw new Error('Valid token not returned');
          }
        }),
        catchError((error: any) => throwError(error))
      );
  }

  getPermissions(
    token: string,
    corporates: Auth.ICorporates[]
  ): Observable<Auth.IPermissions> {
    const { accounts } = this.decodeToken(token);
    let account: any;

    if (accounts.length === 1) {
      account = accounts[0];
    } else {
      corporates.find(
        (corporate) =>
          (account = accounts.find(
            (acc) => acc.corporate.uuid === corporate.uuid
          ))
      );
    }

    if (!account || !account.permissions || !account.corporate) {
      return throwError('error');
    }

    const { permissions } = account;

    if (permissions.adminGroupUuid && !permissions.operationRole) {
      return this.angularFs
        .collection('permissions')
        .doc(permissions.adminGroupUuid)
        .get()
        .pipe(
          map((res) => res.data() as Auth.IPermissions),
          catchError((error: any) => throwError(error))
        );
    }

    if (!!permissions.adminGroupUuid && !!permissions.operationRole) {
      return this.angularFs
        .collection('permissions')
        .doc(permissions.adminGroupUuid)
        .get()
        .pipe(
          map((res) => {
            return {
              name: (res.data() as Auth.IPermissions)?.name,
              tags: [
                ...permissionTags.OPERATION,
                ...(res.data() as Auth.IPermissions)?.tags,
              ],
            };
          }),
          catchError((error: any) => throwError(error))
        );
    }

    if (!permissions.adminGroupUuid) {
      const ops: Auth.IPermissions = {
        name: 'Operation',
        tags: [...permissionTags.OPERATION],
      };
      return of(ops);
    }
  }

  getSelfProfileNerv(): Observable<Auth.Account> {
    return this.http
      .get<{ response: { message: string; data: Auth.Account } }>(
        `${this.url}/v10/account/profile/nerv/self`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  updateSelfAccountProfile(payload: Auth.IAccount): Observable<any> {
    const { identity, document } = payload;

    return this.http
      .put(`${this.url}/v11/account/profile/self`, {
        identity,
        document,
      })
      .pipe(
        map(() => ({ ...payload })),
        catchError((error: any) => throwError(error))
      );
  }

  updateSelfPhone(phone: Auth.IPhone): Observable<any> {
    return this.http
      .put(`${this.url}/v10/account/profile/self/phone`, { phone })
      .pipe(
        map(() => ({ phone })),
        catchError((error: any) => throwError(error))
      );
  }

  updateSelfPassword(password: string): Observable<any> {
    return this.http
      .put(`${this.url}/v10/account/profile/self/password`, { password })
      .pipe(
        map(() => password),
        catchError((error: any) => throwError(error))
      );
  }

  updateSelfImage(payload): Observable<Auth.IAccount> {
    const formData: any = new FormData();

    formData.append('image', payload.file);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .put<IResponse<Auth.IAccount>>(
        `${this.url}/v10/account/profile/self/photo`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        map((res: IResponse<Auth.IAccount>) => {
          return {
            ...payload,
            image: res.response.data.image,
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  logout() {
    this.angularFireAuth.signOut();
    this.angularFireDb.database.goOffline();

    localStorage.clear();

    return of(true);
  }

  getCountriesCallingCodes(): Observable<Auth.IPhoneCode[]> {
    return this.http
      .get<{ response: { data: Auth.IPhoneCode[]; message: string } }>(
        `${this.url}/v10/country/calling-codes`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }
}
