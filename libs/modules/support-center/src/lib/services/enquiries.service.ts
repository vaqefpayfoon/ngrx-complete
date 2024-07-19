import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IEnquiries } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class EnquiriesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getEnquiries(
    config: IEnquiries.IConfig,
    filters?: IEnquiries.IFilter,
    sorts?: IEnquiries.ISort
  ): Observable<IEnquiries.IData> {
    const httpParams = [];

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (!!filters[key]) {
          httpParams.push([`filter[${key}]=${filters[key]}`]);
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
      .get<IResponse<IEnquiries.IData>>(`${this.url}/v11/enquiry`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.enquiry),
        catchError((error: any) => throwError(error))
      );
  }

  getEnquiry(uuid: string): Observable<IEnquiries.IDocument> {
    return this.http
      .get<IResponse<IEnquiries.IDocument>>(
        `${this.url}/v11/enquiry/${uuid}`
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.enquiry),
        catchError((error: any) => throwError(error))
      );
  }

  updateEnquiry(enquiry: IEnquiries.IDocument): Observable<IEnquiries.IDocument> {
    const updateDocumnet: IEnquiries.IUpdate = {
      status: enquiry.status,
      comment: enquiry.comment,
    };

    return this.http
      .put<IResponse<IEnquiries.IDocument>>(
        `${this.url}/v11/enquiry/${enquiry.uuid}`,
        updateDocumnet
      )

      .pipe(
        delay(500),
        map(() => enquiry),
        catchError((error: any) => throwError(error))
      );
  }
}
