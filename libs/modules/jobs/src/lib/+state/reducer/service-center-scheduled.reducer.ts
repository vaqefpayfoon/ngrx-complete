import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ServiceCenterScheduledActions } from '../actions';

import { IReservations, ICalendar } from '../../models';
import { IError } from '@neural/shared/data';

export interface ServiceCenterScheduledState
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
  selectedReservation: IReservations.IDocument;
  loaded: boolean;
  loading: boolean;
  error: IError;
  totals: any;
  slots: IReservations.IReservationSlots;
}

export const adapter: EntityAdapter<IReservations.MyReservations> = createEntityAdapter<
   IReservations.MyReservations
>({
  selectId: (completed) =>completed?.uuid || null ,
});

export function getDaysByMonthYear(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export const initialState: ServiceCenterScheduledState = adapter.getInitialState(
  {
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
      IReservations.Status.NOT_OPERATIONAL,
      IReservations.Status.FLEET_EN_ROUTE,
      IReservations.Status.JOB_IN_PROGRESS,
      IReservations.Status.JOB_COMPLETED,
      IReservations.Status.JOB_PENDING,
      IReservations.Status.NO_SHOW
    ],
    filters: null,
    selectedReservation: null,
    loaded: false,
    loading: false,
    error: null,
    totals: null,
    slots: null
  }
);

const serviceCenterScheduledReducer = createReducer(
  initialState,

  on(
    ServiceCenterScheduledActions.SetServiceCenterScheduledFilter,
    (_, { payload }) => {
      const filters = payload;

      return adapter.removeAll({
        ...initialState,
        loading: true,
        filters,
      });
    }
  ),

  on(
    ServiceCenterScheduledActions.GetServiceCenterScheduledJobReport,
    (state) => {
      return {
        ...state,
        reports: {
          ...state.reports,
          jobs: null,
        },
      };
    }
  ),

  on(
    ServiceCenterScheduledActions.GetServiceCenterScheduledAmendedReport,
    (state) => {
      return {
        ...state,
        reports: {
          ...state.reports,
          amendedInvoices: null,
        },
      };
    }
  ),

  on(
    ServiceCenterScheduledActions.GetServiceCenterScheduledAmendedReport,
    (state) => {
      return {
        ...state,
        reports: {
          ...state.reports,
          services: null,
        },
      };
    }
  ),

  on(ServiceCenterScheduledActions.ChangeDate, (state, { payload }) => {
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

  on(
    ServiceCenterScheduledActions.GetServiceCenterCalendarListSuccess,
    (state, { payload }) => {
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
    }
  ),

  on(ServiceCenterScheduledActions.ResetDate, (state) => {
    return {
      ...state,
      error: null,
      dateList: initialState.dateList,
    };
  }),

  on(
    ServiceCenterScheduledActions.LoadServiceCenterScheduledSuccess,
    (state, { payload:{reservations,totals} }) => {
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
    ServiceCenterScheduledActions.GetServiceCenterSlotsSuccess,
    (state, { payload }) => {
      return  {
        ...state,
        slots: payload,
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),

  on(
    ServiceCenterScheduledActions.LoadServiceCenterScheduledFail,
    ServiceCenterScheduledActions.CancelServiceCenterScheduledFail,
    ServiceCenterScheduledActions.CompleteServiceCenterScheduledFail,
    ServiceCenterScheduledActions.ServiceCenterAssignOperationTeamFail,
    ServiceCenterScheduledActions.GetServiceCenterScheduledFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(
    ServiceCenterScheduledActions.GetServiceCenterScheduledSuccess,
    (state, { payload }) =>{
   return   adapter.upsertOne(payload, {
        ...state,
        selectedReservation: payload,
        error: null,
      })
     } ),

  on(
    ServiceCenterScheduledActions.GetServiceCenterScheduledReportSuccess,
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
    ServiceCenterScheduledActions.GetServiceCenterScheduledAmendedReportSuccess,
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

  on(
    ServiceCenterScheduledActions.GetServiceCenterScheduledJobReportSuccess,
    (state, { payload }) => {
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
    }
  ),

  on(
    ServiceCenterScheduledActions.CompleteServiceCenterScheduledSuccess,
    ServiceCenterScheduledActions.ServiceCenterAssignOperationTeamSuccess,
    ServiceCenterScheduledActions.ResetServiceCenterReservationSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(
    ServiceCenterScheduledActions.CancelServiceCenterScheduledSuccess,
    (state, { payload }) => {
      return adapter.removeOne(payload.uuid, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(ServiceCenterScheduledActions.IncrementDate, (state) => {
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

  on(ServiceCenterScheduledActions.DecrementDate, (state) => {
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

  on(ServiceCenterScheduledActions.ResetDate, (state) => {
    return {
      ...state,
      error: null,
      dateList: initialState.dateList,
    };
  }),

  on(
    ServiceCenterScheduledActions.ResetSelectedServiceCenterScheduled,
    (state) => {
      return {
        ...state,
        selectedReservation: null,
      };
    }
  ),

  on(ServiceCenterScheduledActions.ResetServiceCenterCalendar, (state) => {
    return {
      ...state,
      error: null,
      calendar: null,
    };
  }),

  on(
    ServiceCenterScheduledActions.DeleteServiceCenterScheduledSuccess,
    (state, { payload }) => {
      return adapter.removeOne(payload.uuid, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  )
);

export function reducer(
  state: ServiceCenterScheduledState | undefined,
  action: ServiceCenterScheduledActions.ServiceCenterScheduledsActionsUnion
) {
  return serviceCenterScheduledReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Service Center Scheduled uuids
export const selectServiceCenterScheduledUuids = selectIds;

// select the dictionary of Service Center Scheduled entities
export const selectServiceCenterScheduledEntities = selectEntities;

// select the array of Service Center Scheduled
export const selectAllServiceCenterScheduled = selectAll;

// select the total Service Center Scheduled count
export const selectServiceCenterScheduledTotal = selectTotal;
