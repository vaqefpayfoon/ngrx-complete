import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ICalendars } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class CalendarsService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getCalendar(
    filters: ICalendars.IGetCalendar
  ): Observable<ICalendars.IDocument[]> {
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
      .get<IResponse<ICalendars.IDocument[]>>(`${this.url}/v10/calendar/nerv`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.calendars),
        catchError((error: any) => throwError(error))
      );
  }

  updateCalendarSlot(
    payload: ICalendars.IUpdateCalendarSlot
  ): Observable<ICalendars.IDocument> {
    const {
      ['uuid']: uuid,
      ['iso']: iso,
      ['time']: time,
      ...updateDocument
    } = payload;

    return this.http
      .put<IResponse<ICalendars.IDocument>>(
        `${this.url}/v10/calendar/${uuid}/${iso}`,
        updateDocument
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.calendar),
        catchError((error: any) => throwError(error))
      );
  }

  generateCalendar(
    payload: ICalendars.IGenerateInternalCalendars
  ): Observable<string> {
    return this.http
      .post<IResponse<{ message: string }>>(
        `${this.url}/v10/calendar/generate`,
        payload
      )
      .pipe(
        delay(500),
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  updateCalendar(
    payload: ICalendars.IUpdateInternalCalendar
  ): Observable<ICalendars.IDocument> {
    const { ['uuid']: uuid, ['day']: day, ...updateDocument } = payload;

    return this.http
      .put<IResponse<ICalendars.IDocument>>(
        `${this.url}/v10/calendar/${uuid}`,
        updateDocument
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.calendar),
        catchError((error: any) => throwError(error))
      );
  }
}
