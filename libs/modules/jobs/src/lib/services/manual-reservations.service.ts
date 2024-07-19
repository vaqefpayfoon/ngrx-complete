import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IManualReservations, IReservations } from '../models';
import { IResponse } from '@neural/shared/data';
import { Auth } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class ManualReservationsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getManualReservations(
    config: IManualReservations.IConfig,
    filters?: IManualReservations.IFilter,
    sorts?: IManualReservations.ISort
  ): Observable<IManualReservations.IData> {
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
        if (Array.isArray(filters[key])) {
          httpParams.push([`filter[${key}][]=${filters[key]}`]);
        } else {
          httpParams.push([`filter[${key}]=${filters[key]}`]);
        }
      }
    }

    for (const key in sorts) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (!!filters[key]) {
          httpParams.push([`sort[${key}]=${filters[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IManualReservations.IData>>(
        `${this.url}/v10/manual-reservation`,
        {
          params,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.manualReservations),
        catchError((error: any) => throwError(error))
      );
  }

  getOperationAccounts(
    corporateUuid: string,
    brnachUuid: string,
    config: IManualReservations.IConfig
  ): Observable<IManualReservations.IOperationData> {
    const string = `limit=${config.limit}&page=${config.page}&corporateUuid=${corporateUuid}&filter[corporate.branches][]=${brnachUuid}&filter[permissions.operationRole]=${Auth.OperationRole.CSO}&filter[permissions.operationRole]=${Auth.OperationRole.SERVICE_ADVISOR}`;

    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<IManualReservations.IOperationData>>(
        `${this.url}/v11/account/operation`,
        {
          params,
        }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.accounts),
        catchError((error: any) => throwError(error))
      );
  }

  getManualReservation(
    uuid: string
  ): Observable<IManualReservations.IDocument> {
    return this.http
      .get<IResponse<IManualReservations.IDocument>>(
        `${this.url}/v10/manual-reservation/${uuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.manualReservation),
        catchError((error: any) => throwError(error))
      );
  }

  createManualReservation(
    manualReservation: IManualReservations.ICreate
  ): Observable<IManualReservations.IDocument> {
    return this.http
      .post(`${this.url}/v12/manual-reservation?customerTag=${manualReservation.customerTag}`, manualReservation)
      .pipe(
        delay(500),
        map(
          (res: IResponse<IManualReservations.IDocument>) =>
            res.response.data.manualReservation
        ),
        catchError((error: any) => throwError(error))
      );
  }

  updateManualReservation(
    manualReservation: IManualReservations.IUpdate
  ): Observable<IManualReservations.IDocument> {
    const {
      operationUuid,
      account,
      accountVehicle,
      calendar,
      integration,
      remark,
      logistic,
      serviceLines,
      customerTag
    } = manualReservation;

    const updateDoc: IManualReservations.IUpdate = {
      operationUuid,
      account,
      accountVehicle,
      calendar,
      integration,
      remark,
      logistic,
      serviceLines,
      customerTag
    };

    return this.http
      .put<IResponse<IManualReservations.IDocument>>(
        `${this.url}/v12/manual-reservation/${manualReservation.uuid}?customerTag=${updateDoc.customerTag}`,
        updateDoc
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.updatedManualReserv),
        catchError((error: any) => throwError(error))
      );
  }

  deleteManualReservation(
    manualReservation: IManualReservations.IDocument
  ): Observable<IManualReservations.IDocument> {
    return this.http
      .delete<IResponse<IManualReservations.IDocument>>(
        `${this.url}/v10/manual-reservation/${manualReservation.uuid}`
      )
      .pipe(
        delay(500),
        map(() => manualReservation),
        catchError((error: any) => throwError(error))
      );
  }

  completeManualReservation(
    manualReservation: IManualReservations.IDocument
  ): Observable<IManualReservations.IDocument> {
    return this.http
      .put<IResponse<IManualReservations.IDocument>>(
        `${this.url}/v10/manual-reservation/complete/${manualReservation.uuid}`,
        {}
      )
      .pipe(
        delay(500),
        map(() => manualReservation),
        catchError((error: any) => throwError(error))
      );
  }

  resetManualReservation(
    manualReservation: IManualReservations.IDocument
  ): Observable<IManualReservations.IDocument> {
    return this.http
      .put<IResponse<IManualReservations.IDocument>>(
        `${this.url}/v10/manual-reservation/reset/${manualReservation.uuid}`,
        {}
      )
      .pipe(
        delay(500),
        map(() => manualReservation),
        catchError((error: any) => throwError(error))
      );
  }

  cancelManualReservation(
    manualReservation: IManualReservations.IDocument
  ): Observable<IManualReservations.IDocument> {
    return this.http
      .put(
        `${this.url}/v10/manual-reservation/cancel/${manualReservation.uuid}`,
        {}
      )
      .pipe(
        delay(500),
        map(() => manualReservation),
        catchError((error: any) => throwError(error))
      );
  }

  getDMSCustomers(
    dms: IManualReservations.IDMSFilter,
    corporateUuid: string,
    branchUuid: string
  ): Observable<any> {
    let config = `${this.url}/v10/manual-reservation/dms/customer/${corporateUuid}/${branchUuid}?${dms.key}=${dms.name}`;
    if (dms.firstName != '') {
      config = `${this.url}/v10/manual-reservation/dms/customer/${corporateUuid}/${branchUuid}?${dms.key}=${dms.name}&firstName=${dms.firstName}`
    }
    return this.http
      .get<IResponse<IManualReservations.IDMSCustomer[]>>(
        config
      )
      .pipe(
        delay(500),
        map((res) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  getDMSVehicles(
    customerId: string,
    corporateUuid: string,
    branchUuid: string
  ): Observable<any> {
    return this.http
      .get<IResponse<IReservations.IAccountVehicle[]>>(
        `${this.url}/v10/manual-reservation/dms/vehicle/${corporateUuid}/${branchUuid}/${customerId}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleMakes(
    corporateUuid: string,
    branchUuid: string,
    config?: IManualReservations.IConfig,
  ): Observable<IManualReservations.IVehicleMakes[]> {
    const httpParams = [];
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');
    const params: HttpParams = new HttpParams({
      fromString,
    });
    return this.http
      .get<
        IResponse<
          IManualReservations.ICDKVehicle<IManualReservations.IVehicleMakes>
        >
      >(
        `${this.url}/v10/manual-reservation/dms/makes/${corporateUuid}/${branchUuid}`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.vehicleMakes.docs),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleModels(
    makeId: string,
    corporateUuid: string,
    branchUuid: string,
    config?: IManualReservations.IConfig,
  ): Observable<IManualReservations.IVehicleModels[]> {
    const httpParams = [];
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');
    const params: HttpParams = new HttpParams({
      fromString,
    });
    return this.http
      .get<
        IResponse<
          IManualReservations.ICDKVehicle<IManualReservations.IVehicleModels>
        >
      >(
        `${this.url}/v10/manual-reservation/dms/models/${corporateUuid}/${branchUuid}/${makeId}`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.vehicleModels.docs),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleYearMakes(
    makeId: string,
    modelId: string,
    corporateUuid: string,
    branchUuid: string,
    config?: IManualReservations.IConfig,
  ): Observable<IManualReservations.IVehicleYearMakes[]> {
    const httpParams = [];
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        if (!!config[key]) {
          httpParams.push([`${key}=${config[key]}`]);
        }
      }
    }

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });
    return this.http
      .get<
        IResponse<
          IManualReservations.ICDKVehicle<IManualReservations.IVehicleYearMakes>
        >
      >(
        `${this.url}/v10/manual-reservation/dms/years/${corporateUuid}/${branchUuid}/${makeId}/${modelId}`,
        { params }
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.vehicleYears.docs),
        catchError((error: any) => throwError(error))
      );
  }
}
