import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IFleet } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getFleetes(
    branchUuid: string,
    config: IFleet.IConfig
  ): Observable<IFleet.IData> {
    return this.http
      .get<IResponse<IFleet.IData>>(
        `${this.url}/v10/fleet?limit=${config.limit}&page=${
          config.page
        }&filter[branchUuid]=${branchUuid}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.fleets),
        catchError((error: any) => throwError(error))
      );
  }

  getFleet(uuid: string): Observable<IFleet.IDocument> {
    return this.http
      .get<IResponse<IFleet.IDocument>>(`${this.url}/v10/fleet/${uuid}`)
      .pipe(
        delay(500),
        map((res: IResponse<IFleet.IDocument>) => res?.response?.data?.fleet),
        catchError((error: any) => throwError(error))
      );
  }

  activateFleet(payload: IFleet.IDocument) {
    return this.http
      .put(`${this.url}/v10/fleet/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateFleet(payload: IFleet.IDocument) {
    return this.http
      .put(`${this.url}/v10/fleet/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  createFleet(fleet: IFleet.ICreate): Observable<IFleet.IDocument> {
    return this.http.post(`${this.url}/v10/fleet`, fleet).pipe(
      delay(500),
      map((res: IResponse<IFleet.IDocument>) => res.response.data.fleet),
      catchError((error: any) => throwError(error))
    );
  }

  updateFleet(fleet: IFleet.IDocument): Observable<IFleet.IDocument> {
    const { branchUuid, name, numberPlate }: IFleet.IUpdate = fleet;

    const fleetParams: IFleet.IUpdate = {
      branchUuid,
      name,
      numberPlate
    };

    return this.http
      .put<IResponse<IFleet.IDocument>>(
        `${this.url}/v10/fleet/${fleet.uuid}`,
        fleetParams
      )
      .pipe(
        delay(500),
        map(() => fleet),
        catchError((error: any) => throwError(error))
      );
  }
}
