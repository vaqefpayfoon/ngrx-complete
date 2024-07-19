import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IWarranties } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class WarrantyService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getWarranties(config: IWarranties.IConfig): Observable<IWarranties.IData> {
    return this.http
      .get<IResponse<IWarranties.IData>>(
        `${this.url}/v10/service-recall?limit=${config.limit}&page=${
          config.page
        }`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.serviceRecalles),
        catchError((error: any) => throwError(error))
      );
  }

  getWarranty(uuid: string): Observable<IWarranties.IDocument> {
    return this.http
      .get<IResponse<IWarranties.IDocument>>(`${this.url}/v10/service-recall/${uuid}`)
      .pipe(
        delay(500),
        map(
          (res: IResponse<IWarranties.IDocument>) => res?.response?.data?.serviceRecall
        ),
        catchError((error: any) => throwError(error))
      );
  }

  createWarranty(
    warranty: IWarranties.ICreate,
    payload: IWarranties.IDocumentVin
  ): Observable<IWarranties.IDocument> {
    return this.http
      .post<IResponse<IWarranties.IDocument>>(
        `${this.url}/v10/service-recall`,
        warranty
      )
      .pipe(
        delay(500),
        map(res => {
          const { account, accountVehicle } = payload;
          const response: IWarranties.IDocument = {
            account,
            accountVehicle,
            ...res.response.data.serviceRecalles
          };
          return response;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleByVIN({
    vin
  }: IWarranties.IVin): Observable<IWarranties.IDocumentVin> {
    return this.http
      .get<{ response: { message: string; data: IWarranties.IDocumentVin } }>(
        `${this.url}/v10/service-recall/VIN/${vin}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  activateWarranty(payload: IWarranties.IDocument) {
    return this.http
      .put(`${this.url}/v10/service-recall/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateWarranty(payload: IWarranties.IDocument) {
    return this.http
      .put(`${this.url}/v10/service-recall/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  closeServiceRecall(form: IWarranties.IClose, payload: IWarranties.IDocument) {
    return this.http
      .put(`${this.url}/v10/service-recall/${payload.uuid}/close`, form)
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  warrantyReminderReport(
    corporateUuid: string
  ): Observable<IWarranties.IWarrantiesReport> {
    return this.http
      .get<IResponse<IWarranties.IWarrantiesReport>>(
        `${
          this.url
        }/v10/analytic/report/warranty/reminder?corporateUuid=${corporateUuid}&resultType=EXCEL`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.analytics),
        catchError((error: any) => throwError(error))
      );
  }
}
