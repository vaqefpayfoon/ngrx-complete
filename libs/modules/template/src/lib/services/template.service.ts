import { Injectable, Inject } from '@angular/core';

// Http clients
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

// RxJs & Opertators
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Interfaces
import { ITemplates } from '../models';
import { IResponse } from '@neural/shared/data';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  url = `${this.env.api.community}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  getTemplates(
    config: ITemplates.IConfig,
    filters?: ITemplates.IFilter[]
  ): Observable<ITemplates.IData> {
    let string = `limit=${config.limit}&page=${config.page}`;

    filters.map(filter => {
      for (const property in filter) {
        if (property) {
          if (filter[property] instanceof Array) {
            string += `&filter[${property}][]=${filter[property]}`;
          } else {
            string += `&filter[${property}]=${filter[property]}`;
          }
        }
      }
    });

    const params: HttpParams = new HttpParams({
      fromString: string
    });

    return this.http
      .get<IResponse<ITemplates.IData>>(`${this.url}/v10/template`, {
        params
      })
      .pipe(
        delay(500),
        map(res => res.response.data.templates),
        catchError((error: any) => throwError(error))
      );
  }

  getTemplate(uuid: string): Observable<ITemplates.IDocument> {
    return this.http
      .get<IResponse<ITemplates.IDocument>>(`${this.url}/v10/template/${uuid}`)
      .pipe(
        delay(500),
        map(res => res.response.data.template),
        catchError((error: any) => throwError(error))
      );
  }

  createMasterTemplate(
    template: ITemplates.ICreateMaster
  ): Observable<ITemplates.IDocument> {
    return this.http
      .post<IResponse<ITemplates.IDocument>>(
        `${this.url}/v10/template/master`,
        template
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<ITemplates.IDocument>) => res.response.data.template
        ),
        catchError((error: any) => throwError(error))
      );
  }

  createFromMasterTemplate(
    template: ITemplates.ICreateFromMaster
  ): Observable<ITemplates.IDocument> {

    const { ['uuid']: uuid, ...payload } = template;

    return this.http
      .post<IResponse<ITemplates.IDocument>>(
        `${this.url}/v10/template/${template.uuid}`,
        payload
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<ITemplates.IDocument>) => res.response.data.template
        ),
        catchError((error: any) => throwError(error))
      );
  }

  createTemplate(
    template: ITemplates.ICreate
  ): Observable<ITemplates.IDocument> {
    return this.http
      .post<IResponse<ITemplates.IDocument>>(
        `${this.url}/v10/template`,
        template
      )
      .pipe(
        delay(500),
        map(
          (res: IResponse<ITemplates.IDocument>) => res.response.data.template
        ),
        catchError((error: any) => throwError(error))
      );
  }

  updateTemplate(payload: ITemplates.IUpdate): Observable<ITemplates.IUpdate> {
    return this.http
      .put<IResponse<ITemplates.IUpdate>>(
        `${this.url}/v10/template/${payload.uuid}`,
        payload
      )
      .pipe(
        delay(500),
        map(() => payload),
        catchError((error: any) => throwError(error))
      );
  }

  activateTemplate(payload: ITemplates.IDocument) {
    return this.http
      .put(`${this.url}/v10/template/${payload.uuid}/activate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deactivateTemplate(payload: ITemplates.IDocument) {
    return this.http
      .put(`${this.url}/v10/template/${payload.uuid}/deactivate`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }

  deleteTemplate(payload: ITemplates.IDocument) {
    return this.http
      .delete(`${this.url}/v10/template/${payload.uuid}`, {})
      .pipe(
        delay(500),
        catchError((error: any) => throwError(error))
      );
  }
}
