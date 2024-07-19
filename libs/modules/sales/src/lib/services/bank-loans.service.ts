import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { IBankLoan } from '../models';
import { IResponse, IRequest } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class BankLoansService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getBankLoansBySale({
    payload,
  }: IRequest<string>): Observable<IBankLoan.IDocument[]> {
    return this.http
      .get<IResponse<IBankLoan.IDocument[]>>(
        `${this.url}/v10/bank-loan/sale/${payload}`
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.bankLoans),
        catchError((error: any) => throwError(error))
      );
  }

  createBankLoans({
    payload,
  }: IRequest<IBankLoan.CreateLoans>): Observable<IBankLoan.IDocument[]> {
    return this.http
      .post<IResponse<IBankLoan.IDocument[]>>(
        `${this.url}/v10/bank-loan/loans`,
        payload
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.bankLoans),
        catchError((error: any) => throwError(error))
      );
  }

  deleteBankLoan(uuid: string) {
    return this.http
      .delete<{ response: { message: string } }>(
        `${this.url}/v10/bank-loan/${uuid}`
      )
      .pipe(
        delay(500),
        map((res) => res.response.message),
        catchError((error: any) => throwError(error))
      );
  }

  updateBankLoan({
    payload,
  }: IRequest<IBankLoan.IUpdateBankLoan>): Observable<IBankLoan.IDocument> {
    const { uuid } = payload;

    return this.http
      .put<IResponse<IBankLoan.IDocument>>(
        `${this.url}/v10/bank-loan/${uuid}`,
        payload
      )

      .pipe(
        delay(500),
        map((res) => res.response.data.bankLoan),
        catchError((error: any) => throwError(error))
      );
  }
}
