import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ICountry } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getCountries(): Observable<ICountry.IDocument[]> {
    return this.http
      .get<IResponse<ICountry.IDocument[]>>(`${this.url}/v10/country`)
      .pipe(
        delay(500),
        map((res: any) => res.response.data),
        catchError((error: any) => throwError(error))
      );
  }

  getCountryNames(): Observable<string[]> {
    return this.http
      .get<IResponse<string[]>>(`${this.url}/v10/country/all`)
      .pipe(
        delay(500),
        map((res: IResponse<string[]>) => res.response.data.countries),
        catchError((error: any) => throwError(error))
      );
  }

  getCountryByName(country: string): Observable<ICountry.IGetCountry> {
    return this.http
      .get<IResponse<ICountry.IGetCountry>>(
        `${this.url}/v10/country/all/${country}`
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<ICountry.IGetCountry>) => res.response.data.country
        ),
        catchError((error: any) => throwError(error))
      );
  }
}
