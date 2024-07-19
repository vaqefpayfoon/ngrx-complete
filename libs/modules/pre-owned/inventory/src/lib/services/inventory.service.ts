import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay, tap } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IInventory } from '../models';

import { IResponse, options } from '@neural/shared/data';
import { serialize } from 'object-to-formdata';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

// Interceptors
const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  url = `${this.env.api.community}`;

  inventoriesCollection: AngularFirestoreCollection<IInventory.IInventory>;
  inventories: Observable<any>;

  constructor(
    private angularFireDb: AngularFirestore,
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  uploadFile(payload: IInventory.ICreate): Observable<IInventory.IData> {
    const { uuid, ...object } = payload;

    const formData = serialize(object, options);

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.http
      .post<IResponse<IInventory.IData>>(
        `${this.url}/v10/analytic/pre-owned/upload-inventory?corporateUuid=${uuid}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res: IResponse<IInventory.IData>) => res.response.data.url),
        catchError((error: any) => throwError(error))
      );
  }

  getPreOwnedImportsFireBase(
    corporateUuid: string
  ): Observable<IInventory.IInventory[]> {
    return this.angularFireDb
      .collection(`preOwnedImports`)
      .doc(`${corporateUuid}`)
      .collection('items')
      .valueChanges()
      .pipe(
        delay(500),
        map((res: any) => {
          if (!!res) {
            return res;
          } else {
            throw new Error('Valid token not returned');
          }
        })
      );
  }
}
