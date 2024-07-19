import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { IError } from '@neural/shared/data';
import { Update } from '@ngrx/entity';
import { createAction, props, union } from '@ngrx/store';
import { IServiceLine } from '../../models';

export const loadServiceLines = createAction('[Hub list] Get ServiceLines Job');
export const loadServiceLinesSuccess = createAction(
  '[Hub list] Get ServiceLines Job success',
  props<{
    serviceLines: IServiceLine.IDocument[];
    pagination: IServiceLine.IPagination;
  }>()
);
export const loadServiceLinesFailed = createAction(
  '[Hub list] Get ServiceLines Job failed',
  props<{ payload: IError }>()
);

export const SetServiceLinePage = createAction(
  '[Hub] Set ServiceLine Job Page',
  props<{ payload: IServiceLine.IConfig }>()
);

export const ChangeServiceLinePage = createAction(
  '[Hub] Change ServiceLine Job Page',
  props<{ payload: IServiceLine.IConfig }>()
);

export const SetServiceLineFilters = createAction(
  '[Hub] Set ServiceLine Job Filters',
  props<{ payload: IServiceLine.IFilter }>()
);

export const GetBranch = createAction(
  '[Customer] Get Branch Job',
  props<{ payload: string }>()
);

export const GetBranchFail = createAction(
  '[Customer] Get Branch Job Fail',
  props<{ payload: any }>()
);

export const GetBranchSuccess = createAction(
  '[Customer] Get Branch Job Success',
  props<{ payload: IBranches.IDocument }>()
);


const all = union({
  loadServiceLines,
  loadServiceLinesSuccess,
  loadServiceLinesFailed,
  SetServiceLinePage,
  ChangeServiceLinePage,
  SetServiceLineFilters,
  GetBranch,
  GetBranchSuccess,
  GetBranchFail,
});
export type ServiceLineActionsUnion = typeof all;
