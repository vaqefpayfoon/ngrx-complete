import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ManualReservationsActions } from '../actions';

import { ICalendars } from '@neural/modules/calendar';
import { IManualReservations, IReservations } from '../../models';
import { IError } from '@neural/shared/data';

// Auth Module
import { Auth } from '@neural/auth';

export interface ManualReservationState
  extends EntityState<IManualReservations.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  filters: IManualReservations.IFilter;
  selectedDay: ICalendars.IDocument;
  selectedSlot: ICalendars.ISlot;
  operations: Auth.IAccount[];
  dmsCustomers: IManualReservations.IDMSCustomer[];
  dmsVehicles: IReservations.IAccountVehicle[];
  vehicleMakes?: IManualReservations.IVehicleMakes[];
  vehicleModels?: IManualReservations.IVehicleModels[];
  yearMakes?: IManualReservations.IVehicleYearMakes[];
  loadedDmsVehicles: boolean;
  loadingDmsVehicles: boolean;
  loadingDmsCustomers: boolean;
  loaded: boolean;
  loading: boolean;
  error: IError | any;
}

export const adapter: EntityAdapter<IManualReservations.IDocument> = createEntityAdapter<
  IManualReservations.IDocument
>({
  selectId: (manualReservations) => manualReservations.uuid,
});

export const initialState: ManualReservationState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: IManualReservations.Config.LIMIT,
    page: 1,
    pages: 1,
  },
  filters: null,
  selectedDay: null,
  selectedSlot: null,
  operations: null,
  dmsCustomers: null,
  dmsVehicles: null,
  vehicleMakes: null,
  vehicleModels: null,
  yearMakes: null,
  loadedDmsVehicles: false,
  loadingDmsVehicles: false,
  loadingDmsCustomers: false,
  loaded: false,
  loading: false,
  error: null,
});

const manualReservationsReducer = createReducer(
  initialState,

  on(ManualReservationsActions.SetManualReservations, (_, { payload }) => {
    const config = payload;
    return adapter.removeAll({
      ...initialState,
      pagination: {
        ...initialState.pagination,
        ...config,
      },
    });
  }),

  on(
    ManualReservationsActions.ChangeManualReservations,
    (state, { payload }) => {
      const { page, limit } = payload;
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page,
          limit,
        },
      };
    }
  ),

  on(ManualReservationsActions.SelectCalendarSlot, (_, { payload }) => {
    const { selectedDay, selectedSlot } = payload;
    return adapter.removeAll({
      ...initialState,
      selectedDay,
      selectedSlot,
    });
  }),

  on(
    ManualReservationsActions.CreateManualReservationSuccess,
    (state, { payload }) => {
      return adapter.addOne(payload, {
        ...state,
        total: state.total + 1,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(
    ManualReservationsActions.UpdateManualReservationSuccess,
    (state, { payload }) =>
      adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      })
  ),

  on(
    ManualReservationsActions.GetManualReservationSuccess,
    (state, { payload }) =>
      adapter.upsertOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      })
  ),

  on(ManualReservationsActions.GetDMSCustomers, (state) => {
    return {
      ...state,
      error: null,
      loadingDmsCustomers: true,
    };
  }),

  on(ManualReservationsActions.GetDMSCustomersSuccess, (state, { payload }) => {
    const dmsCustomers = payload;
    return {
      ...state,
      dmsCustomers,
      error: null,
      loadingDmsCustomers: false,
    };
  }),

  on(ManualReservationsActions.GetDMSCustomersFail, (state) => {
    return {
      ...state,
      error: null,
      loadingDmsCustomers: false,
    };
  }),

  on(ManualReservationsActions.GetDMSVehicles, (state) => {
    return {
      ...state,
      error: null,
      loadingDmsVehicles:true
    };
  }),

  on(ManualReservationsActions.GetDMSVehiclesSuccess, (state, { payload }) => {
    const dmsVehicles = payload;
    return {
      ...state,
      dmsVehicles,
      error: null,
      loadedDmsVehicles: true,
      loadingDmsVehicles:false
    };
  }),

  on(ManualReservationsActions.GetDMSVehiclesFail, (state) => {
    return {
      ...state,
      error: null,
      loadingDmsVehicles: false,
    };
  }),

  on(ManualReservationsActions.ResetDMSVehiclesLoaded, (state) => {
    return {
      ...state,
      error: null,
      loadedDmsVehicles: false,
    };
  }),

  on(ManualReservationsActions.ResetDMSVehicles, (state) => {
    return {
      ...state,
      error: null,
      dmsVehicles:null,
    };
  }),

  on(ManualReservationsActions.ResetDMSCustomers, (state) => {
    return {
      ...state,
      error: null,
      dmsCustomers: null,
    };
  }),

  on(
    ManualReservationsActions.DeleteManualReservationSuccess,
    (state, { payload }) => {
      const selectedSlot: ICalendars.ISlot = {
        ...state.selectedSlot,
        count: state.selectedSlot.count + 1,
      };
      return adapter.removeOne(payload.uuid, {
        ...state,
        total: state.total - 1,
        loading: false,
        loaded: true,
        error: null,
        selectedSlot,
      });
    }
  ),

  on(
    ManualReservationsActions.CompleteManualReservation,
    ManualReservationsActions.CancelManualReservation,
    ManualReservationsActions.ResetManualReservation,
    (state) => {
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    }
  ),

  on(
    ManualReservationsActions.CompleteManualReservationSuccess,
    ManualReservationsActions.ResetManualReservationSuccess,
    ManualReservationsActions.CancelManualReservationSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(ManualReservationsActions.LoadManualReservations, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    ManualReservationsActions.LoadManualReservationsFail,
    ManualReservationsActions.CreateManualReservationFail,
    ManualReservationsActions.UpdateManualReservationFail,
    ManualReservationsActions.DeleteManualReservationFail,
    ManualReservationsActions.GetManualReservationFail,
    ManualReservationsActions.CompleteManualReservationFail,
    ManualReservationsActions.ResetManualReservationFail,
    ManualReservationsActions.CancelManualReservationFail,
    ManualReservationsActions.GetDMSCustomersFail,
    ManualReservationsActions.GetVehicleMakesFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(
    ManualReservationsActions.LoadManualReservationsSuccess,
    (state, { payload: { manualReservations, pagination } }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(manualReservations, {
        ...state,
        total,
        pagination: {
          ...state.pagination,
          page,
          pages,
          limit,
        },
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(
    ManualReservationsActions.GetManualReservationOperationsSuccess,
    (state, { payload }) => {
      const operations = payload;
      return {
        ...state,
        operations,
        error: null,
      };
    }
  ),

  on(ManualReservationsActions.GetVehicleMakesSuccess, (state, { payload }) => {
    const vehicleMakes = payload;
    return {
      ...state,
      vehicleMakes,
      error: null,
      loadedDmsVehicles: true,
      loadingDmsVehicles:false
    };
  }),

  on(ManualReservationsActions.GetVehicleModelsSuccess, (state, { payload }) => {
    const vehicleModels = payload;
    return {
      ...state,
      vehicleModels,
      error: null,
      loadedDmsVehicles: true,
      loadingDmsVehicles:false
    };
  }),

  on(ManualReservationsActions.GetVehicleYearMakesSuccess, (state, { payload }) => {
    const yearMakes = payload;
    return {
      ...state,
      yearMakes,
      error: null,
      loadedDmsVehicles: true,
      loadingDmsVehicles:false
    };
  }),
);

export function reducer(
  state: ManualReservationState | undefined,
  action: ManualReservationsActions.ManualReservationsActionsUnion
) {
  return manualReservationsReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of ManualReservations uuids
export const selectManualReservationsUuids = selectIds;

// select the dictionary of ManualReservations entities
export const selectManualReservationsEntities = selectEntities;

// select the array of ManualReservations
export const selectAllManualReservations = selectAll;

// select the total ManualReservations count
export const selectManualReservationsTotal = selectTotal;
