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

  createCountry(country: ICountry.ICreate): Observable<ICountry.IDocument> {
    const createDocument: ICountry.ICreate = {
      name: country.name,
      currencies: country.currencies.map(currency => currency),
      states: country.states.map(state => state)
    };

    return this.http
      .post<IResponse<ICountry.IDocument>>(
        `${this.url}/v10/country`,
        createDocument
      )
      .pipe(
        map((res: IResponse<ICountry.IDocument>) => res.response.data.country),
        catchError((error: any) => throwError(error))
      );
  }

  updateCountry(country: ICountry.IUpdate): Observable<ICountry.IDocument> {
    const updateDocument: ICountry.IUpdate = {
      name: country.name,
      currencies: country.currencies.map(currency => currency),
      states: country.states.map(state => state)
    };

    return this.http
      .put<IResponse<ICountry.IDocument>>(
        `${this.url}/v10/country/${country.uuid}`,
        updateDocument
      )
      .pipe(
        map((res: IResponse<ICountry.IDocument>) => res.response.data.country),
        catchError((error: any) => throwError(error))
      );
  }

  activateCountry(payload: ICountry.IDocument) {
    return this.http
      .put(`${this.url}/v10/country/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map((res: IResponse<ICountry.IDocument>) => res.response.data.country),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateCountry(payload: ICountry.IDocument) {
    return this.http
      .put(`${this.url}/v10/country/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map((res: IResponse<ICountry.IDocument>) => res.response.data.country),
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
