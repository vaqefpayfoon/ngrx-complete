import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';

import { IRouter } from '../models';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomSerializer
  implements fromRouter.RouterStateSerializer<IRouter> {
  serialize(routerState: RouterStateSnapshot): IRouter {
    let route: ActivatedRouteSnapshot = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams, fragment, outlet }
    } = routerState;

    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, queryParams, params, data: route.data, fragment, outlet };
  }
}
