import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & operators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IVehicle } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getVehicles(
    config: IVehicle.IConfig,
    corporateUuid: string
  ): Observable<IVehicle.IData> {
    let string = `limit=${config.limit}&page=${config.page}&filter[corporateUuid]=${corporateUuid}`;

    if (config && config.filter) {
      const key = Object.keys(config.filter)[0];

      string += `&filter[${key}]=${config.filter[key]}`;
    }

    if (config && config.sort) {
      const key = Object.keys(config.sort)[0].toString();
      const value = config.sort[key];

      string += `&sort[${key.toLowerCase()}]=${value}`;
    }
    const params: HttpParams = new HttpParams({
      fromString: string,
    });

    return this.http
      .get<IResponse<IVehicle.IData>>(`${this.url}/v10/vehicle`, {
        params,
      })
      .pipe(
        delay(500),
        map((res) => res.response.data.vehicles),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicle(uuid: string): Observable<IVehicle.IDocument> {
    return this.http
      .get<IResponse<IVehicle.IDocument>>(`${this.url}/v10/vehicle/${uuid}`)
      .pipe(
        delay(500),
        map((res) => res.response.data.vehicle),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleInspections(uuid: string): Observable<IVehicle.IDataInspections> {
    return this.http
      .get<IResponse<IVehicle.IDataInspections>>(
        `${this.url}/v10/vehicle/inspection/${uuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.inspections),
        catchError((error: any) => throwError(error))
      );
  }

  getTyreWidths(): Observable<string[]> {
    return this.http
      .get<IResponse<string[]>>(`${this.url}/v10/vehicle/tyre/widths`)
      .pipe(
        delay(500),
        map((res) => res.response.data.widths),
        catchError((error: any) => throwError(error))
      );
  }

  getTyreAspectRatios(width: string): Observable<string[]> {
    return this.http
      .get<IResponse<string[]>>(
        `${this.url}/v10/vehicle/tyre/aspect-ratios?width=${width}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.aspectRatios),
        catchError((error: any) => throwError(error))
      );
  }

  getTyreRims(width: string, aspectRatio: string): Observable<string[]> {
    return this.http
      .get<IResponse<string[]>>(
        `${this.url}/v10/vehicle/tyre/rims?width=${width}&aspectRatio=${aspectRatio}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.data.rims),
        catchError((error: any) => throwError(error))
      );
  }

  activateVehicle(payload: IVehicle.IDocument) {
    return this.http
      .put(`${this.url}/v10/vehicle/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateVehicle(payload: IVehicle.IDocument) {
    return this.http
      .put(`${this.url}/v10/vehicle/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  updateVehicle(
    payload: IVehicle.IDocument,
    update: IVehicle.IUpdate
  ): Observable<IVehicle.IDocument> {
    const { uuid } = payload;
    return this.http
      .put<IResponse<IVehicle.IUpdate>>(
        `${this.url}/v10/vehicle/${uuid}`,
        update
      )
      .pipe(
        delay(500),
        map(() => {
          return {
            ...payload,
            ...update,
          };
        }),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleBrands(): Observable<string[]> {
    return this.http.get(`${this.url}/v10/vehicle/brand`).pipe(
      delay(500),
      map((res: any) => res.response.data.brands),
      catchError((error: any) => throwError(error))
    );
  }

  getVehicleModels(brand: string): Observable<string[]> {
    return this.http.get(`${this.url}/v10/vehicle/model?brand=${brand}`).pipe(
      delay(500),
      map((res: any) => res.response.data.models),
      catchError((error: any) => throwError(error))
    );
  }

  getVehicleVariants(
    brand: string,
    model: string
  ): Observable<IVehicle.IVariants[]> {
    return this.http
      .get(`${this.url}/v10/vehicle/variant?brand=${brand}&model=${model}`)
      .pipe(
        delay(500),
        map((res: any) => res.response.data.objects),
        catchError((error: any) => throwError(error))
      );
  }

  getGlobalVehicleBrands(): Observable<string[]> {
    return this.http.get(`${this.url}/v10/vehicle/global/brand`).pipe(
      delay(500),
      map((res: any) => res.response.data.brands),
      catchError((error: any) => throwError(error))
    );
  }

  getGlobalVehicleModels(brand: string): Observable<string[]> {
    return this.http
      .get(`${this.url}/v10/vehicle/global/model?brand=${brand}`)
      .pipe(
        delay(500),
        map((res: any) => res.response.data.models),
        catchError((error: any) => throwError(error))
      );
  }

  getGlobalVehicleVariants(brand: string, model: string): Observable<string[]> {
    return this.http
      .get(
        `${this.url}/v10/vehicle/global/variant?brand=${brand}&model=${model}`
      )
      .pipe(
        delay(500),
        map((res: any) => res.response.data.variants),
        catchError((error: any) => throwError(error))
      );
  }
}
