import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IInsuranceEnquiries } from '../models';
import {
  IResponse,
  IGlobalFilter,
  IGlobalSort,
  IGlobalConfig,
  IGlobalData,
} from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class InsuranceEnquiriesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getInsuranceEnquiries({
    corporateUuid,
    config,
    filters,
    sorts,
  }: {
    corporateUuid: string;
    config: IGlobalConfig;
    filters?: IGlobalSort;
    sorts?: IGlobalFilter;
  }): Observable<IGlobalData<IInsuranceEnquiries.IDocument>> {
    const httpParams = [];

    httpParams.push(`corporateUuid=${corporateUuid}`);

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
      .get<IResponse<IGlobalData<IInsuranceEnquiries.IDocument>>>(
        `${this.url}/v10/insurance-enquiry`,
        {
          params,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.insuranceEnquiries),
        catchError((error: any) => throwError(error))
      );
  }

  getInsuranceEnquiry(uuid: string): Observable<IInsuranceEnquiries.IDocument> {
    return this.http
      .get<IResponse<IInsuranceEnquiries.IDocument>>(
        `${this.url}/v10/insurance-enquiry/${uuid}`
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.insuranceEnquiry),
        catchError((error: any) => throwError(error))
      );
  }

  updateInsuranceEnquiry(
    enquiry: IInsuranceEnquiries.IDocument
  ): Observable<IInsuranceEnquiries.IDocument> {
    const updateDocumnet: IInsuranceEnquiries.IUpdate = {
      status: enquiry?.status,
      adminRemark: enquiry?.adminRemark,
    };

    return this.http
      .put<IResponse<IInsuranceEnquiries.IDocument>>(
        `${this.url}/v10/insurance-enquiry/${enquiry.uuid}`,
        updateDocumnet
      )

      .pipe(
        delay(500),
        map(() => enquiry),
        catchError((error: any) => throwError(error))
      );
  }
}
