import { Data, Params, UrlSegment } from '@angular/router';

export interface IRouter {
  url: string;
  queryParams: Params;
  params: Params;
  data: Data;
  outlet: string;
  fragment: string;
}
