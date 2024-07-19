// loader.interceptors.ts
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from '../services';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    private excludedUrlsRegex: RegExp[];
    private excludedUrls = ['.svg','.png'];

    constructor(public loaderService: LoaderService) {
        this.excludedUrlsRegex =
        this.excludedUrls.map(urlPattern => new RegExp(urlPattern, 'i')) || [];
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const passThrough: boolean = 
        !!this.excludedUrlsRegex.find(regex => regex.test(req.url));
  
        if (passThrough) {
          return next.handle(req);
        }

        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        );
    }
}
