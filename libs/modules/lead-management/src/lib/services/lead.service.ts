import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';
import { IResponse } from '@neural/shared/data';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { ILead, ILeadNotes, ILeadTestDrive, IWishList, leadPurchaseQuotes } from '../models';
import { flattenObject } from 'libs/modules/sales/src/lib/functions';

const moment = _rollupMoment || _moment;

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getLeads(
    config: ILead.IConfig,
    filters?: ILead.IFilter,
    sorts?: ILead.ISort
  ): Observable<ILead.IData> {
    const httpParams = [];

    const createdAt = 'createdAt';

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    for (const key in flattenObject(filters)) {
      if (Object.prototype.hasOwnProperty.call(flattenObject(filters), key)) {
        if (!!flattenObject(filters)[key]) {
          httpParams.push([`filter[${key}]=${flattenObject(filters)[key]}`]);
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(filters, createdAt)) {
      for (const key in filters[createdAt]) {
        if (Object.prototype.hasOwnProperty.call(filters[createdAt], key)) {
          if (!!filters[createdAt]) {
            httpParams.push([
              `filter[${createdAt}][${key}]=${moment(
                filters[createdAt][key]
              ).format('YYYY-M-DD')}`,
            ]);
          }
        }
      }
    }

    for (const key in sorts) {
      if (Object.prototype.hasOwnProperty.call(sorts, key)) {
        if (!!sorts[key]) {
          httpParams.push([`sort[${key}]=${sorts[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });
    return this.http
      .get<IResponse<ILead.IData>>(`${this.url}/v10/lead`, { params })
      .pipe(
        delay(500),
        map((res) => res.response.data.leads),
        catchError((error: any) => throwError(error))
      );
  }
  getLead(uuid: string): Observable<ILead.IDocument> {
    return this.http
      .get<IResponse<ILead.IDocument>>(`${this.url}/v10/lead/${uuid}`)
      .pipe(
        map((res: IResponse<ILead.IDocument>) => res.response.data.lead),
        catchError((error: any) => throwError(error))
      );
  }
  createLead(lead: ILead.ICreate): Observable<ILead.IDocument> {
    return this.http.post(`${this.url}/v10/lead`, lead).pipe(
      map((res: IResponse<ILead.IDocument>) => res.response.data.lead),
      catchError((error: any) => throwError(error))
    );
  }
  updateLead({
    changes,
    lead,
  }: {
    changes: ILead.IUpdate;
    lead: ILead.IDocument | any;
  }): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/lead/${lead.uuid}`,
        changes
      )

      .pipe(
        map((res) => {
          return res.response.data.lead;
        }),
        catchError((error: any) => throwError(error))
      );
  }
  getWishList(uuid: string): Observable<IWishList.IData> {
    return this.http
      .get<IResponse<IWishList.IData>>(
        `${this.url}/v10/lead/wish-lists/${uuid}`
      )
      .pipe(
        map((res: IResponse<IWishList.IData>) => res.response.data.wishLists),
        catchError((error: any) => throwError(error))
      );
  }
  getPurchaseQuotes(uuid: string): Observable<leadPurchaseQuotes.IData> {
    return this.http
      .get<IResponse<leadPurchaseQuotes.IData>>(
        `${this.url}/v10/lead/purchase-quotes/${uuid}`
      )
      .pipe(
        map((res: IResponse<leadPurchaseQuotes.IData>) => res.response.data.purchaseQuotes),
        catchError((error: any) => throwError(error))
      );
  }
  gettestDriver(uuid: string): Observable<ILeadTestDrive.IData> {
    return this.http
      .get<IResponse<ILeadTestDrive.IData>>(
        `${this.url}/v10/lead/test-drives/${uuid}`
      )
      .pipe(
        map((res: IResponse<ILeadTestDrive.IData>) => res.response.data.testDrives),
        catchError((error: any) => throwError(error))
      );
  }
  createLeadNote(leadNote: ILeadNotes.ISaveNote): Observable<ILead.IDocument> {
    return this.http.put(`${this.url}/v10/lead/${leadNote.uuid}/create-note`, leadNote).pipe(
      map((res: IResponse<ILead.IDocument>) => res.response.data.lead),
      catchError((error: any) => throwError(error))
    );
  }
  updateLeadNote(leadNote: ILeadNotes.ISaveNote, noteUuid: string): Observable<ILead.IDocument> {
    return this.http
      .put<IResponse<ILead.IDocument>>(
        `${this.url}/v10/lead/${leadNote.uuid}/edit-note/${noteUuid}`, leadNote,
      ).pipe(
        map((res) => {
          return res.response.data.lead;
        }),
        catchError((error: any) => throwError(error))
      );
  }
  deleteLeadNote(uuid: string, noteUuid: string): Observable<ILead.IDocument> {
    return this.http
      .put<IResponse<ILead.IDocument>>(
        `${this.url}/v10/lead/${uuid}/delete-note/${noteUuid}`,{},
      ).pipe(
        map((res) => {
          return res.response.data.lead;
        }),
        catchError((error: any) => throwError(error))
      );
  }
  sendManualInvitation(uuid: string): Observable<any> {
    return this.http
      .put<IResponse<any>>(
        `${this.url}/v10/lead/${uuid}/manual-invitation`,{},
      ).pipe(
        map((res) => {
          return res.response.message;
        }),
        catchError((error: any) => throwError(error))
      );
  }
}
