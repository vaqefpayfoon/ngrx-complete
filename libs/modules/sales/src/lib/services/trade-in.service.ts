import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ITradeIn } from '../models';
import { IResponse, IBody, IRequest } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class TradeInService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  createTradeIn(
    payload: IRequest<ITradeIn.ICreate>
  ): Observable<ITradeIn.ITradeInDocumnet> {
    return this.http
      .post<IResponse<ITradeIn.ITradeInDocumnet>>(
        `${this.url}/v10/trade-in`,
        payload
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.tradeIn),
        catchError((error: any) => throwError(error))
      );
  }

  updateTradeIn({
    document,
    changes,
  }: IBody<ITradeIn.ITradeInDocumnet, ITradeIn.IUpdate>): Observable<
    ITradeIn.ITradeInDocumnet
  > {
    return this.http
      .put<IResponse<ITradeIn.ITradeInDocumnet>>(
        `${this.url}/v10/trade-in/${document.uuid}`,
        changes
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.tradeIn),
        catchError((error: any) => throwError(error))
      );
  }
}
