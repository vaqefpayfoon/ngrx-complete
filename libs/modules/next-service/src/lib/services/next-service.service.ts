import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ENVIRONMENT, Environment } from '@neural/environment';
import * as _moment from 'moment';
import { Observable, throwError } from "rxjs";
import { flattenObject } from "../functions";
import { INextService } from "../models";
import { default as _rollupMoment } from 'moment';
import { IResponse } from "@neural/shared/data";
import { catchError, delay, map } from "rxjs/operators";

const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root',
})

export class NextService {
    url = `${this.env.api.community}`;
  
    constructor(
      private http: HttpClient,
      @Inject(ENVIRONMENT) private readonly env: Environment
    ) {}
  
    getNextService(
      config: INextService.IConfig,
      filters?: any,
      sorts?: INextService.ISort,
    ): Observable<INextService.ITotal> {
      const httpParams = [];
      
  
      for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
          if (!!config[key]) {
            httpParams.push([`${key}=${config[key]}`]);
          }
        }
      }
  
      for (const key in flattenObject(filters)) {
        if (Object.prototype.hasOwnProperty.call(flattenObject(filters), key)) {
          if (!!flattenObject(filters)[key]) {
            httpParams.push([`filter[${key}]=${flattenObject(filters)[key]}`]);
          }
        }
      }
      // if(filters?.accountVehicle?.nextService?.estimatedEngineOilService?.from) {

      //   const from = filters?.accountVehicle?.nextService?.estimatedEngineOilService?.from;
      //   const to = filters?.accountVehicle?.nextService?.estimatedEngineOilService?.to;
        
      //   const x = {
      //     ...filters
      //   }
      //   delete x['accountVehicle']['nextService']['estimatedEngineOilService']['from']

        
      //   httpParams.push(
      //     `filter[accountVehicle.nextService.estimatedEngineOilService]['from']=${moment(
      //       from
      //     ).format('YYYY-M-DD')}`,
      //   );
      //   httpParams.push(
      //     `filter[accountVehicle.nextService.estimatedEngineOilService]['to']=${moment(
      //       to
      //     ).format('YYYY-M-DD')}`,
      //   );
      // }
      // if (Object.prototype.hasOwnProperty.call(filters, accountVehicle)) {
      //   const temp1 = filters[accountVehicle];
      //   for (const key1 in temp1) {
      //     if (Object.prototype.hasOwnProperty.call(temp1, key1)) {
      //       for(const key2 in temp1) {
      //         const temp2 = temp1[key2];
      //         for(const key3 in temp2) {
      //           if (!!temp2[key3]) {
      //             let temp3 = temp2[key3];
      //             for(const key4 in temp3) {
      //               const temp4 = temp3[key4]
      //               httpParams.push([
      //                 `filter[accountVehicle.nextService.estimatedEngineOilService][${key4}]=${moment(
      //                   temp4
      //                 ).format('YYYY-M-DD')}`,
      //               ]);
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
  
      // for (const key in sorts) {
      //   if (Object.prototype.hasOwnProperty.call(sorts, key)) {
      //     if (!!sorts[key]) {
      //       httpParams.push([`sort[${key}]=${sorts[key]}`]);
      //     }
      //   }
      // }
  
      const fromString = httpParams.join('&');
  
      const params: HttpParams = new HttpParams({
        fromString,
      });
      return this.http
        .get<INextService.ITotal>(`${this.url}/v10/reservation/next-service`, { params })
        .pipe(
          map((res: any) => res.response.data),
          catchError((error: any) => throwError(error))
        );
    }
  }
  