import { IError } from "@neural/shared/data";
import { createAction, props, union } from "@ngrx/store";
import { INextService } from "../../models";

export const loadNextServices = createAction(
    '[Hub list] Get NextServices'
  );
  
  export const loadNextServicesSuccess = createAction(
    '[Hub list] Get NextServices success',
    props<{ data: INextService.ITotal; pagination: INextService.IPagination }>()
  );
  
  export const loadNextServicesFailed = createAction(
    '[Hub list] Get NextServices failed',
    props<{ payload: IError }>()
  );
  
  export const SetNextServicesPage = createAction(
    '[Hub] Set NextServices Page',
    props<{ payload: INextService.IConfig }>()
  );
  
  export const ChangeNextServicesPage = createAction(
    '[Hub] Change NextServices Page',
    props<{ payload: INextService.IConfig }>()
  );
  
  export const SetNextServicesFilters = createAction(
    '[Hub] Set NextServices Filters',
    props<{ payload: INextService.IFilter }>()
  );

  export const RedirectToNextService = createAction(
    '[Hub] Redirect To NextService'
  );
  const all = union({
    loadNextServices,
    loadNextServicesSuccess,
    loadNextServicesFailed,
    SetNextServicesPage,
    ChangeNextServicesPage,
    SetNextServicesFilters,
    RedirectToNextService
  });
  export type NextServiceActionsUnion = typeof all;