import { createAction, props, union } from '@ngrx/store';

import { NavigationExtras } from '@angular/router';

export const Go = createAction(
  '[router] GO',
  props<{
    payload: {
      path: any[];
      query?: object;
      extras?: NavigationExtras;
    };
  }>()
);
export const Back = createAction('[router] BACK');
export const Forward = createAction('[router] FORWARD');
export const RouteChange = createAction(
  '[router] Route Change',
  props<{ payload: { params: any; path: string } }>()
);

const all = union({ Go, Back, Forward, RouteChange });
export type RouterActionsUnion = typeof all;
