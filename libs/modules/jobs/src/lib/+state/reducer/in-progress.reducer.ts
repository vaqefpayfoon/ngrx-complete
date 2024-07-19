import { createReducer, on } from '@ngrx/store';

import { InProgressActions } from '../actions';

import { IReservations } from '../../models';

export interface InProgressState {
  inProgressJobList: IReservations.IInProgressJobList | null;
  inProgressJob: IReservations.IInProgressJob | null;
  dailyReport: IReservations.IAnalytics;
  loaded: boolean;
  loading: boolean;
  error: any;
  reportError: any;
}

export const initialState = {
  inProgressJobList: null,
  inProgressJob: null,
  dailyReport: null,
  loading: false,
  loaded: false,
  error: null,
  reportError: null,
};

const inProgressReducer = createReducer(
  initialState,
  on(InProgressActions.GetInProgressJob, (state, { payload }) => {
    return {
      ...state,
      error: null,
      uuid: payload,
    };
  }),
  on(InProgressActions.GetInProgressJobSuccess, 
    (state, { payload }) => {
      const inProgressJob = payload;
      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        inProgressJob,
      };
    }
  ),
  on(InProgressActions.LoadInProgressJob,
      InProgressActions.LoadInProgressJobList, () => {
    return {
      ...initialState,
      loading: true,
    };
  }),

  on(InProgressActions.GetOperationDailyReport, (state) => {
    return {
      ...state,
      dailyReport: null,
    };
  }),

  on(InProgressActions.GetOperationDailyReportSuccess, (state, { payload }) => {
    const dailyReport = payload;

    return {
      ...state,
      dailyReport,
    };
  }),

  on(InProgressActions.GetOperationDailyReportFail, (state, { payload }) => {
    const reportError = payload;

    return { ...state, reportError, dailyReport: null };
  }),

  on(
    InProgressActions.LoadInProgressJobSuccess,
    InProgressActions.LoadInProgressJobRealTimeSuccess,
    (state, { payload }) => {
      // const { job } = payload;

      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        inProgressJob: payload,
      };
    }
  ),
  on(
    InProgressActions.LoadInProgressJobListSuccess,
    (state, { payload }) => {

      return {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        inProgressJobList: payload,
      };
    }
  ),
  on(
    InProgressActions.LoadInProgressJobFail,
    InProgressActions.LoadInProgressJobListFail,
    InProgressActions.UploadRepairOrderFail,
    InProgressActions.UploadProgressInvoiceFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(InProgressActions.LoadInProgressJobRealTimeFail, (state, { payload }) => {
    const error = payload;

    return {
      ...state,
      inProgressJob: null,
      loaded: false,
      loading: false,
      error,
    };
  }),

  on(InProgressActions.CompleteReservationByOpertaionSuccess, (state) => {
    return {
      ...state,
      inProgressJob: null,
      loaded: true,
      loading: false,
    };
  })
);

export function reducer(
  state: InProgressState | undefined,
  action: InProgressActions.InProgressActionsUnion
) {
  return inProgressReducer(state, action);
}

export const getInProgressJob = (state: InProgressState) => state.inProgressJob;

export const getInProgressJobList = (state: InProgressState) => state.inProgressJobList;
