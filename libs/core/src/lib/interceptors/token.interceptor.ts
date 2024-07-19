import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/auth';

import { Observable } from 'rxjs';

import { switchMap, take } from 'rxjs/operators';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';
export const InterceptorLoginSkipHeader = 'X-Skip-Login-Interceptor';
export const ContentType = 'Content-Type';

// Device detector
import { DeviceDetectorService } from 'ngx-device-detector';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private excludedUrlsRegex: RegExp[];
  private excludedUrls = ['.svg', '.png'];

  constructor(
    private af: AngularFireAuth,
    private detector: DeviceDetectorService,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {
    this.excludedUrlsRegex =
      this.excludedUrls.map((urlPattern) => new RegExp(urlPattern, 'i')) || [];
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const device = {
      os: this.detector.os,
      osVersion: this.detector.os_version,
      device: this.detector.device,
      browser: this.detector.browser,
      browserVersion: parseInt(this.detector.browser_version, 10),
      appIdentifier: this.env.identifier,
      appVersion: this.env.version,
    };

    const passThrough: boolean = !!this.excludedUrlsRegex.find((regex) =>
      regex.test(request.url)
    );

    if (passThrough) {
      return next.handle(request);
    }

    // Login
    if (request.headers.has(InterceptorLoginSkipHeader)) {
      const headers = request.headers.delete(InterceptorLoginSkipHeader);
      return next.handle(request.clone({ headers }));
    }

    request = request.clone({
      headers: request.headers.set('Content-Type', 'application/json'),
    });

    request = request.clone({
      headers: request.headers.set('x-user-agent', JSON.stringify(device)),
    });

    // form data
    if (request.headers.has(InterceptorSkipHeader)) {
      request = request.clone({
        headers: request.headers.delete(ContentType),
      });

      request = request.clone({
        headers: request.headers.delete(InterceptorSkipHeader),
      });
    }

    return this.af.idTokenResult.pipe(
      take(1),
      switchMap((tokenResult) => {
        const { token } = tokenResult;

        request = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`),
        });

        return next.handle(request);
      })
    );
  }
}
