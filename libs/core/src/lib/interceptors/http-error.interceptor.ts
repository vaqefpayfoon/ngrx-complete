import { Injectable } from '@angular/core';

import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromAuth from '@neural/auth';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private authFacade: fromAuth.AuthFacade
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(0),
      catchError((errorResponse: HttpErrorResponse) => {
        // todo: fix error redirection
        // if (errorResponse.status === 401) {
        //   this.toggleSnackbar(errorResponse.error.response.message);
        // }
        return throwError(errorResponse);
      })
    );
  }

  toggleSnackbar(message: string) {
    return this.snackBar
      .open(message, 'Logout', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['snackbar--custom']
      })
      .afterDismissed()
      .subscribe(() => this.authFacade.onLogout());
  }
}
