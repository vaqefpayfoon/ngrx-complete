import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IReservations, ICalendar } from '../models';
import { IResponse } from '@neural/shared/data';
import { ICorporates } from '@neural/modules/customer/corporate';

// Firebase
import { AngularFireDatabase } from '@angular/fire/database';

// Interceptors
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment,
    private angularFireDb: AngularFireDatabase
  ) {}

  getReservations(
    branchUuid: string,
    config: IReservations.IConfig
  ): Observable<IReservations.IData> {
    const { statusFilter, mobileService,serviceType } = config;

    const filters = statusFilter
      .map((status) => {
        return `filter[status]=${status}`;
      })
      .join('&');

    return this.http
      .get<IResponse<IReservations.IData>>(
        `${this.url}/v10/reservation?limit=${config.limit}&page=${config.page}&${filters}&filter[branch.uuid]=${branchUuid}&sort[calendar.slot]=1&filter[mobileService]=${mobileService}&filter[serviceType]=${serviceType}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.reservations),
        catchError((error: any) => throwError(error))
      );
  }

  getMixedReservations(
    filters: IReservations.IFilter,
    statuses?: string[]
  ): Observable<IReservations.IMixedData> {
    const httpParams: any[] = [];

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (Array.isArray(filters[key])) {
          httpParams.push([`filter[${key}][]=${filters[key]}`]);
        } else {
          httpParams.push([`filter[${key}]=${filters[key]}`]);
        }
      }
    }

    statuses.forEach((status) => {
      httpParams.push([`filter[status]=${status}`]);
    });

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IReservations.IMixedData>>(`${this.url}/v12/reservation`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  getCompletedReservations(
    filters: IReservations.IFilter,
    statuses?: string[]
  ): Observable<IReservations.IMixedData> {
    const httpParams: any[] = [];

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (Array.isArray(filters[key])) {
          httpParams.push([`filter[${key}][]=${filters[key]}`]);
        } else {
          httpParams.push([`filter[${key}]=${filters[key]}`]);
        }
      }
    }

    statuses.forEach((status) => {
      httpParams.push([`filter[status]=${status}`]);
    });

    const fromString = httpParams.join('&');

    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
      .get<IResponse<IReservations.IMixedData>>(`${this.url}/v11/reservation`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  getReservation(uuid: string): Observable<IReservations.IDocument> {
    return this.http
      .get<IResponse<IReservations.IDocument>>(
        `${this.url}/v10/reservation/${uuid}`
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<IReservations.IDocument>) =>
            res?.response?.data?.reservation
        ),
        catchError((error: any) => throwError(error))
      );
  }

  getCorporate(uuid: string): Observable<ICorporates.IDocument> {
    return this.http
      .get<IResponse<ICorporates.IDocument>>(
        `${this.url}/v10/corporate/${uuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.corporate),
        catchError((error: any) => throwError(error))
      );
  }

  getCompleteReservations2(
    branchUuid: string,
    config: IReservations.IConfig
  ): Observable<IReservations.IData> {
    const { statusFilter, dateFilter, mobileService } = config;

    const filters = statusFilter
      .map((status) => {
        return `filter[status]=${status}`;
      })
      .join('&');

    return this.http
      .get<IResponse<IReservations.IData>>(
        `${this.url}/v10/reservation?limit=${config.limit}&page=${config.page}&${filters}&filter[calendar.slot]=${dateFilter}&filter[branch.uuid]=${branchUuid}&sort[calendar.slot]=1&filter[mobileService]=${mobileService}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.reservations),
        catchError((error: any) => throwError(error))
      );
  }

  getCompletedReservation(uuid: string): Observable<IReservations.IDocument> {
    return this.http
      .get<IResponse<IReservations.IDocument>>(
        `${this.url}/v10/reservation/${uuid}`
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<IReservations.IDocument>) =>
            res?.response?.data?.reservation
        ),
        catchError((error: any) => throwError(error))
      );
  }

  getInProgress(): Observable<IReservations.IInProgressJob> {
    return this.http
      .get<IResponse<IReservations.IInProgressJob>>(
        `${this.url}/v11/reservation/inprogress`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.inProgress),
        catchError((error: any) => throwError(error))
      );
  }
  getInProgressList(): Observable<IReservations.IInProgressJobList> {
    return this.http
      .get<IResponse<IReservations.IInProgressJobList>>(
        `${this.url}/v10/reservation/inprogress/list`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.inProgress),
        catchError((error: any) => throwError(error))
      );
  }

  getInProgressFilter(
    referenceNumber: string
  ): Observable<IReservations.IInProgressJob> {
    return this.http
      .get<IResponse<IReservations.IInProgressJob>>(
        `${this.url}/v10/reservation/inprogress/list?filter[referenceNumber]=${referenceNumber}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data?.inProgress[0]),
        catchError((error: any) => throwError(error))
      );
  }
  getInProgressJobsFireBase(
    uuid: string
  ): Observable<IReservations.IInProgressJob> {
    // todo: change fs bhavior
    return this.angularFireDb
      .object(`inProgressJobs/${uuid}`)
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
  reservationStatus(uuid: string, type: string, reservation: boolean, status: string): any {
    let apiPath = 'manual-reservation';
    // let status = 'COMPLETED';
    if (reservation) {
      apiPath = 'reservation';
      // status = 'IN_PROGRESS';
    }
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')
      .set('Content-Type', 'multipart/form-data');
    return this.http.put(
      `${this.url}/v10/${apiPath}/${uuid}/${type}/${status}`,
      {
        headers,
      }
    );
  }

  uploadInProgressRepairOrder(
    ro: IReservations.ICreate
  ): Observable<IReservations.IInProgressJob> {
    let apiPath = 'manual-reservation';
    let version = 'v10';
    if (ro.reservation) {
      apiPath = 'reservation';
      version = 'v11';
    }
    const { file, uuid, number } = ro;

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')
      .set('Content-Type', 'multipart/form-data');
    return this.http
      .put<{
        response: { message: string; data: IReservations.IInProgressJob };
      }>(
        `${this.url}/${version}/${apiPath}/inprogress/${uuid}/upload-repair-order?number=${number}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => {
          if(!ro.reservation) {
            this.reservationStatus(uuid, ro.type, ro.reservation, 'COMPLETED').subscribe();
          }
          return res.response.data;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  uploadInProgressInvoice(
    invoice: IReservations.IUpdate
  ): Observable<IReservations.IInProgressJob> {
    const { file, uuid, number, payableAmount, upSellAmount } = invoice;
    let apiPath = 'manual-reservation';
    let version = 'v10';
    if (invoice.reservation) {
      apiPath = 'reservation';
      version = 'v11';
    }
    let formData: any = new FormData();

    if (file) {
      formData.append('file', file);
    } else {
      formData = {};
    }

    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')
      .set('Content-Type', 'multipart/form-data');

    return this.http
      .put<{
        response: { message: string; data: IReservations.IInProgressJob };
      }>(
        `${this.url}/${version}/${apiPath}/inprogress/${uuid}/upload-invoice?number=${number}&payableAmount=${payableAmount}&upSellAmount=${upSellAmount}`,
        formData,
        {
          headers,
        }
      )
      .pipe(
        delay(500),
        map((res) => {
          if(!invoice.reservation) {
            this.reservationStatus(uuid, invoice.type, invoice.reservation, 'COMPLETED').subscribe();
          }
          return res.response.data
        }),
        catchError((error: any) => throwError(error))
      );
  }

  cancelReservationMobile(
    payload: IReservations.IDocument
  ): Observable<IReservations.IDocument> {
    return this.http
      .put(`${this.url}/v10/reservation/cancel/${payload.uuid}/mobile`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  cancelReservationServiceCenter(
    payload: IReservations.IDocument
  ): Observable<IReservations.IDocument> {
    return this.http
      .put(
        `${this.url}/v10/reservation/cancel/${payload.uuid}/service-center`,
        {}
      )
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  completeReservation(
    payload: IReservations.IDocument
  ): Observable<IReservations.IDocument> {
    return this.http
      .put(`${this.url}/v10/reservation/complete/${payload.uuid}`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }
  reservationCompleteStatus(uuid: string, status: string, reservation: boolean) {
    let apiPath = 'manual-reservation';
    let version = 'v10';
    if (reservation) {
      apiPath = 'reservation';
      version = 'v11';
    }
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, '')
      .set('Content-Type', 'multipart/form-data');
    return this.http.put(
      `${this.url}/${version}/${apiPath}/inprogress/${uuid}/status`,
      {
        status,
      },
      {
        headers,
      }
    );
  }
  resetReservation(
    payload: IReservations.IDocument
  ): Observable<IReservations.IDocument> {
    return this.http
      .put(`${this.url}/v11/reservation/reset/${payload.uuid}`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  rescheduleMobileReservation({
    slot,
    reservation,
  }: IReservations.IReschedule): Observable<IReservations.IDocument> {
    return this.http
      .put(
        `${this.url}/v10/reservation/reschedule/${reservation.uuid}/mobile`,
        {
          slot,
        }
      )
      .pipe(
        delay(500),
        map(() => {
          return {
            ...reservation,
            calendar: {
              ...reservation.calendar,
              slot,
            },
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  rescheduleServiceCenterReservation({
    slot,
    reservation,
  }: IReservations.IReschedule): Observable<IReservations.IDocument> {
    return this.http
      .put(
        `${this.url}/v10/manual-reservation/reschedule/${reservation.uuid}`,
        { slot }
      )
      .pipe(
        delay(500),
        map(() => {
          return {
            ...reservation,
            calendar: {
              ...reservation.calendar,
              slot,
            },
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  assignOperationTeam(
    payload: IReservations.IDocument,
    assign: IReservations.IAssign
  ) {
    return this.http
      .put<IResponse<IReservations.IDocument>>(
        `${this.url}/v10/reservation/assign/${payload.uuid}`,
        assign
      )
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  reservationServiceReport(
    corporateUuid: string,
    branchUuid: string,
    date: string,
    serviceType: string
  ): Observable<IReservations.IServicesReport> {
    return this.http
      .get<IResponse<IReservations.IServicesReport>>(
        `${this.url}/v10/analytic/report/reservation/service?corporateUuid=${corporateUuid}&branchUuid=${branchUuid}&date=${date}&resultType=EXCEL&serviceType=${serviceType}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.analytics),
        catchError((error: any) => throwError(error))
      );
  }

  reservationAmendedReport(
    corporateUuid: string,
    branchUuid: string,
    date: string,
    serviceType: string
  ): Observable<IReservations.IAmendedsReport> {
    return this.http
      .get<IResponse<IReservations.IAmendedsReport>>(
        `${this.url}/v10/analytic/report/reservation/amended?corporateUuid=${corporateUuid}&branchUuid=${branchUuid}&date=${date}&resultType=EXCEL&serviceType=${serviceType}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.analytics),
        catchError((error: any) => throwError(error))
      );
  }

  reservationJobReport(
    corporateUuid: string,
    branchUuid: string,
    date: string,
    serviceType: string
  ): Observable<IReservations.IJobsReport> {
    return this.http
      .get<IResponse<IReservations.IJobsReport>>(
        `${this.url}/v10/analytic/report/reservation/job?corporateUuid=${corporateUuid}&branchUuid=${branchUuid}&date=${date}&resultType=EXCEL&serviceType=${serviceType}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.analytics),
        catchError((error: any) => throwError(error))
      );
  }

  operationDailyReport(date: string): Observable<IReservations.IDailyReport> {
    return this.http
      .get<IResponse<IReservations.IDailyReport>>(
        `${this.url}/v10/analytic/report/operation/daily?date=${date}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.analytics),
        catchError((error: any) => throwError(error))
      );
  }

  listCalendar(
    filters: ICalendar.IGetCalendar
  ): Observable<ICalendar.IDocument[]> {
    const httpParams = [];

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (filters[key] instanceof Array) {
          filters[key].forEach((element) => {
            httpParams.push([`${key}[]=${element}`]);
          });
        } else if (!!filters[key]) {
          httpParams.push([`${key}=${filters[key]}`]);
        }
      }
    }

    const params: HttpParams = new HttpParams({
      fromString: httpParams.join('&'),
    });

    return this.http
      .get<IResponse<ICalendar.IDocument[]>>(`${this.url}/v10/calendar/nerv`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.calendars),
        catchError((error: any) => throwError(error))
      );
  }

  getReservationSlots(filters: IReservations.IFilter): Observable<IReservations.IReservationSlots> {
    const httpParams: any[] = [];

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        if (Array.isArray(filters[key])) {
          httpParams.push([`${key}[]=${filters[key]}`]);
        } else {
          httpParams.push([`${key}=${filters[key]}`]);
        }
      }
    }
    const fromString = httpParams.join('&');
    const params: HttpParams = new HttpParams({
      fromString,
    });

    return this.http
    .get<IResponse<IReservations.IReservationSlots>>(`${this.url}/v11/calendar/nerv`, {
      params,
    })
    .pipe(
      delay(500),
      map((res) => res.response.data.calendars),
      catchError((error: any) => throwError(error))
    );

  }
}
