import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CompletedActions } from '../actions';

import { IReservations, ICalendar } from '../../models';
import { IError } from '@neural/shared/data';

export interface CompletedState
  extends EntityState<IReservations.MyReservations> {
  calendar: { [day: string]: ICalendar.IDocument };
  reports: {
    jobs: IReservations.IJob;
    services: IReservations.IJob;
    amendedInvoices: IReservations.IJob;
  };
  dateList: {
    days: number;
    year: number;
    month: number;
  };
  statuses: string[];
  filters: IReservations.IFilter;
  selectedCompleted: IReservations.IDocument;
  loaded: boolean;
  loading: boolean;
  error: IError;
}

export const adapter: EntityAdapter<IReservations.MyReservations> = createEntityAdapter<
  IReservations.MyReservations
>({
  selectId: (reservation) => reservation.uuid || null,
});

export function getDaysByMonthYear(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export const initialState: CompletedState = adapter.getInitialState({
  reports: null,
  calendar: null,
  dateList: {
    days: getDaysByMonthYear(
      new Date().getMonth() + 1,
      new Date().getFullYear()
    ),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  statuses: [
    IReservations.Status.JOB_PENDING,
    IReservations.Status.FLEET_EN_ROUTE,
    IReservations.Status.JOB_IN_PROGRESS,
    IReservations.Status.JOB_COMPLETED,
    IReservations.Status.NO_SHOW,
  ],
  filters: null,
  selectedCompleted: null,
  loaded: false,
  loading: false,
  error: null,
});

const completedReducer = createReducer(
  initialState,

  on(CompletedActions.SetMobileServiceScheduledFilter, (_, { payload }) => {
    const filters = payload;

    return adapter.removeAll({
      ...initialState,
      loading: true,
      filters,
    });
  }),

  on(CompletedActions.GetReservationJobReport, (state) => {
    return {
      ...state,
      reports: {
        ...state.reports,
        jobs: null,
      },
    };
  }),

  on(CompletedActions.GetReservationAmendedReport, (state) => {
    return {
      ...state,
      reports: {
        ...state.reports,
        amendedInvoices: null,
      },
    };
  }),

  on(CompletedActions.GetReservationServiceReport, (state) => {
    return {
      ...state,
      reports: {
        ...state.reports,
        services: null,
      },
    };
  }),

  on(CompletedActions.ChangeDate, (state, { payload }) => {
    const dateFilter = payload;
    return adapter.removeAll({
      ...state,
      loading: true,
      filters: {
        ...state.filters,
        ['calendar.slot']: dateFilter,
      },
    });
  }),

  on(CompletedActions.GetCalendarListSuccess, (state, { payload }) => {
    const calendar = payload.reduce(
      (
        entries: { [day: string]: ICalendar.IDocument },
        list: ICalendar.IDocument
      ) => {
        return {
          ...entries,
          [list.day]: list,
        };
      },
      null
    );
    return {
      ...state,
      error: null,
      calendar,
    };
  }),

  on(CompletedActions.ResetDate, (state) => {
    return {
      ...state,
      error: null,
      dateList: initialState.dateList,
    };
  }),

  on(
    CompletedActions.LoadCompletedReservationSuccess,
    (state, { payload: { reservations, totals } }) => {
      return adapter.setAll(reservations, {
        ...state,
        totals,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(
    CompletedActions.LoadCompletedReservationFail,
    CompletedActions.CancelReservationFail,
    CompletedActions.ResetReservationFail,
    CompletedActions.CompleteReservationFail,
    CompletedActions.AssignOperationTeamFail,
    CompletedActions.GetCompletedReservationFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(CompletedActions.GetCompletedReservationSuccess, (state, { payload}) =>{
   return adapter.upsertOne(payload, {
      ...state,
      selectedCompleted: payload,
      error: null,
    })
   } ),

  on(
    CompletedActions.GetReservationServiceReportSuccess,
    (state, { payload }) => {
      const { services } = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        reports: {
          ...state.reports,
          services,
        },
      };
    }
  ),

  on(
    CompletedActions.GetReservationAmendedReportSuccess,
    (state, { payload }) => {
      const { amendedInvoices } = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        reports: {
          ...state.reports,
          amendedInvoices,
        },
      };
    }
  ),

  on(CompletedActions.GetReservationJobReportSuccess, (state, { payload }) => {
    const { jobs } = payload;

    return {
      ...state,
      loaded: false,
      loading: false,
      reports: {
        ...state.reports,
        jobs,
      },
    };
  }),

  on(
    CompletedActions.ResetReservationSuccess,
    CompletedActions.CompleteReservationSuccess,
    CompletedActions.AssignOperationTeamSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(CompletedActions.CancelReservationSuccess, (state, { payload }) => {
    return adapter.removeOne(payload.uuid, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(
    CompletedActions.RescheduleMobileReservationSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(CompletedActions.IncrementDate, (state) => {
    let { month, year } = state.dateList;

    if (month >= 1 && month <= 12) {
      if (month === 12) {
        year++;
        month = 1;
      } else {
        month++;
      }
    }

    return {
      ...state,
      dateList: {
        month,
        year,
        days: getDaysByMonthYear(month, year),
      },
    };
  }),

  on(CompletedActions.DecrementDate, (state) => {
    let { month, year } = state.dateList;

    if (month <= 12 || month >= 1) {
      if (month === 1) {
        year--;
        month = 12;
      } else {
        month--;
      }
    }

    return {
      ...state,
      dateList: {
        month,
        year,
        days: getDaysByMonthYear(month, year),
      },
    };
  }),

  on(CompletedActions.ResetMobileServiceCalendar, (state) => {
    return {
      ...state,
      error: null,
      calendar: null,
    };
  }),

  on(CompletedActions.ResetSelectedCompletedReservation, (state) => {
    return {
      ...state,
      selectedCompleted: null,
    };
  }),

  on(CompletedActions.DeleteMobileReservationSuccess, (state, { payload }) => {
    return adapter.removeOne(payload.uuid, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  })
);

export function reducer(
  state: CompletedState | undefined,
  action: CompletedActions.CompletedsActionsUnion
) {
  return completedReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Completed uuids
export const selectCompletedUuids = selectIds;

// select the dictionary of Completed entities
export const selectCompletedEntities = selectEntities;

// select the array of Completed
export const selectAllCompleted = selectAll;

// select the total Completed count
export const selectCompletedTotal = selectTotal;
