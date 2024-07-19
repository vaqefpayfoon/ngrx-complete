import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { PromotionsActions } from '../actions';

import { IPromotions } from '../../models';
import { IError } from '@neural/shared/data';
import { Auth } from '@neural/auth';
import { IVehicle } from '@neural/modules/customer/vehicles';

export interface PromotionsState extends EntityState<IPromotions.IDocument> {
  total: number;
  codeValidity: IError;
  selectedPromotion: IPromotions.IDocument;
  filters: IPromotions.IFilter;
  sorts: IPromotions.ISort;
  accounts: { [uuid: string]: Auth.IAccount };
  vehicles: { [uuid: string]: IVehicle.IDocument };
  brands: IPromotions.IBrand[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  loaded: boolean;
  loading: boolean;
  error: IError;
}

export const adapter: EntityAdapter<IPromotions.IDocument> = createEntityAdapter<
  IPromotions.IDocument
>({
  selectId: (promotion) => promotion.uuid,
});

export const initialState: PromotionsState = adapter.getInitialState({
  total: 0,
  codeValidity: null,
  selectedPromotion: null,
  sorts: {
    createdAt: -1,
  },
  filters: null,
  accounts: null,
  vehicles: null,
  brands: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  loaded: false,
  loading: false,
  error: null,
});

const promotionReducer = createReducer(
  initialState,

  on(PromotionsActions.SetPromotionsPage, (_, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...initialState,
      pagination: {
        ...initialState.pagination,
        page,
        limit,
      },
    });
  }),

  on(PromotionsActions.ChangePromotionsPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...state,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    };
  }),

  on(PromotionsActions.SetPromotionsFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: IPromotions.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters: {
        ...state.filters,
        ...filters,
      },
    };
  }),

  on(PromotionsActions.LoadPromotions, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
      accounts: null,
      vehicles: null,
    };
  }),

  on(PromotionsActions.CodeValidationFail, (state, { payload }) => {
    const codeValidity = payload;

    return {
      ...state,
      codeValidity,
    };
  }),

  on(PromotionsActions.GetAccountByEmail, (state) => {
    return {
      ...state,
      searchedAccount: null,
    };
  }),

  on(PromotionsActions.GetBrands, (state) => {
    return {
      ...state,
      brands: null,
    };
  }),

  on(
    PromotionsActions.LoadPromotionsFail,
    PromotionsActions.CreatePromotionFail,
    PromotionsActions.UpdatePromotionFail,
    PromotionsActions.GetPromotionFail,
    PromotionsActions.ActivatePromotionFail,
    PromotionsActions.DeactivatePromotionFail,
    PromotionsActions.GetAccountByEmailFail,
    PromotionsActions.GetBrandsFail,
    (state, { payload }) => {
      const error = payload;
      return adapter.removeAll({
        ...state,
        loading: false,
        loaded: false,
        total: 0,
        error,
      });
    }
  ),

  on(
    PromotionsActions.LoadPromotionsSuccess,
    (state, { promotions, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(promotions, {
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

  on(PromotionsActions.CreatePromotionSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(PromotionsActions.UpdatePromotionSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    PromotionsActions.GetPromotionSuccess,
    (state, { payload, vehicles, accounts }) => {
      const accountsReduce = accounts.reduce(
        (
          entries: { [uuid: string]: Auth.IAccount },
          account: Auth.IAccount
        ) => {
          return {
            ...entries,
            [account.uuid]: account,
          };
        },
        { ...state.accounts }
      );
      const vehiclesReduce = vehicles.reduce(
        (
          entries: { [identificationNumber: string]: IVehicle.IDocument },
          vehicle: IVehicle.IDocument
        ) => {
          return {
            ...entries,
            [vehicle.identificationNumber]: vehicle,
          };
        },
        { ...state.vehicles }
      );
      return adapter.upsertOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        selectedPromotion: payload,
        error: null,
        vehicles: vehiclesReduce,
        accounts: accountsReduce,
      });
    }
  ),

  on(
    PromotionsActions.ActivatePromotionsSuccess,
    PromotionsActions.DeactivatePromotionSuccess,
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
    PromotionsActions.ActivateRedeemPromotionsSuccess,
    PromotionsActions.DeactivateRedeemPromotionSuccess,
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
    PromotionsActions.ResetPromotionStatus,
    PromotionsActions.ResetPromotionRedeem,
    (state, { payload }) =>
      adapter.updateOne(payload, {
        ...state,
        loading: false,
        error: null,
      })
  ),

  on(PromotionsActions.ResetSelectedPromotion, (state) => {
    return {
      ...state,
      selectedPromotion: null,
      codeValidity: null,
      brands: null,
    };
  }),

  on(PromotionsActions.GetAccountByEmailSuccess, (state, { payload }) => {
    const searchedAccount = payload;
    return {
      ...state,
      searchedAccount,
    };
  }),

  on(PromotionsActions.GetBrandsSuccess, (state, { payload }) => {
    const brands = payload;
    return {
      ...state,
      brands,
    };
  }),

  on(PromotionsActions.GetInboxAccountsSuccess, (state, { payload }) => {
    const accounts = payload.reduce(
      (entries: { [uuid: string]: Auth.IAccount }, account: Auth.IAccount) => {
        return {
          ...entries,
          [account.uuid]: account,
        };
      },
      { ...state.accounts }
    );

    return {
      ...state,
      accounts,
      loading: false,
      loaded: true,
      error: null,
    };
  }),

  on(PromotionsActions.ResetFilters, (state) => {
    return {
      ...state,
      accounts: null,
      vehicles: null,
      loading: false,
      loaded: true,
      error: null,
    };
  }),

  on(PromotionsActions.LoadVehiclesSuccess, (state, { payload }) => {
    const vehicles = payload.reduce(
      (
        entries: { [identificationNumber: string]: IVehicle.IDocument },
        vehicle: IVehicle.IDocument
      ) => {
        return {
          ...entries,
          [vehicle.identificationNumber]: vehicle,
        };
      },
      { ...state.vehicles }
    );

    return {
      ...state,
      vehicles,
      loading: false,
      loaded: true,
      error: null,
    };
  })
);

export function reducer(
  state: PromotionsState | undefined,
  action: PromotionsActions.PromotionsActionsUnion
) {
  return promotionReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Promotions uuids
export const selectPromotionsUuids = selectIds;

// select the dictionary of Promotions entities
export const selectPromotionsEntities = selectEntities;

// select the array of Promotions
export const selectAllPromotions = selectAll;

// select the total Promotions count
export const selectPromotionsTotal = selectTotal;
