import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IVehicleReference } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class VehicleReferencesService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getVehicleReferences(
    config: IVehicleReference.IConfig
  ): Observable<IVehicleReference.IData> {
    let string = `limit=${config.limit}&page=${config.page}`;

    if (config && config.filter) {
      const key = Object.keys(config.filter)[0];

      string += `&filter[${key}]=${config.filter[key]}`;
    }

    if (config && config.sort) {
      const key = Object.keys(config.sort)[0].toString();
      const value = config.sort[key];

      string += `&sort[${key}]=${value}`;
    }
    const params: HttpParams = new HttpParams({
      fromString: string
    });

    return this.http
      .get<IResponse<IVehicleReference.IData>>(
        `${this.url}/v10/vehicle/reference`,
        {
          params
        }
      )
      .pipe(
        delay(500),
        map(res => res.response.data.vehicleReferences),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleReference(uuid: string): Observable<IVehicleReference.IDocument> {
    return this.http
      .get<IResponse<IVehicleReference.IDocument>>(
        `${this.url}/v10/vehicle/reference/${uuid}`
      )
      .pipe(
        delay(500),
        map(res => res.response.data.vehicleReference),
        catchError((error: any) => throwError(error))
      );
  }

  activateVehicleReference(payload: IVehicleReference.IDocument) {
    return this.http
      .put(`${this.url}/v10/vehicle/reference/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateVehicleReference(payload: IVehicleReference.IDocument) {
    return this.http
      .put(`${this.url}/v10/vehicle/reference/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  createVehicleReference(
    payload: IVehicleReference.ICreate
  ): Observable<IVehicleReference.IDocument> {
    return this.http
      .post<IResponse<IVehicleReference.IDocument>>(
        `${this.url}/v10/vehicle/reference`,
        payload
      )
      .pipe(
        delay(500),
        map(res => res.response.data.vehicleReference),
        catchError((error: any) => throwError(error))
      );
  }

  updateVehicleReference(
    payload: IVehicleReference.IDocument
  ): Observable<IVehicleReference.IDocument> {
    const { uuid, type, unit, engine, production } = payload;

    const updateParams: IVehicleReference.IUpdate = {
      type,
      unit,
      engine,
      production
    };

    return this.http
      .put<IResponse<IVehicleReference.IUpdate>>(
        `${this.url}/v10/vehicle/reference/${uuid}`,
        updateParams
      )
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleBrands(type: string): Observable<string[]> {
    return this.http.get(`${this.url}/v10/vehicle/brand?type=${type}`).pipe(
      delay(500),
      map((res: any) => res.response.data.brands),
      catchError((error: any) => throwError(error))
    );
  }

  getVehicleModels(type: string, brand: string): Observable<string[]> {
    return this.http
      .get(`${this.url}/v10/vehicle/model?type=${type}&brand=${brand}`)
      .pipe(
        delay(500),
        map((res: any) => res.response.data.models),
        catchError((error: any) => throwError(error))
      );
  }

  getVehicleVariants(
    type: string,
    brand: string,
    model: string
  ): Observable<IVehicleReference.IVariants[]> {
    return this.http
      .get(
        `${
          this.url
        }/v10/vehicle/variant?type=${type}&brand=${brand}&model=${model}`
      )
      .pipe(
        delay(500),
        map((res: any) => res.response.data.objects),
        catchError((error: any) => throwError(error))
      );
  }
}
