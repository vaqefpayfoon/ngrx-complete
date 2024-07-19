import { ISalesAdvisor } from '@neural/modules/administration';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { ILead, ILeadTestDrive, IWishList, leadPurchaseQuotes } from '../../models';
import { LeadsAction } from '../actions';

export interface ILeadManagementsState extends EntityState<ILead.IDocument> {
  total: number;
  filters?: ILead.IFilter;
  sorts: ILead.ISort;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedLead: ILead.IDocument;
  salesAdvisor: ISalesAdvisor.ISADocument[];
  wishLists: IWishList.IData;
  purchaseQuotes: leadPurchaseQuotes.IData;
  testDrives: ILeadTestDrive.IData;
  loaded: boolean;
  loading: boolean;
  error?: any;
  sa: ILead.SA;
  brands: string[] | null;
}

export const adapter: EntityAdapter<ILead.IDocument> = createEntityAdapter<ILead.IDocument>({
  selectId: (selectedLead) => selectedLead.uuid
});

const initialState: ILeadManagementsState = adapter.getInitialState({
  uuid: null,
  total: 0,
  sorts: {
    updatedAt: -1,
  },
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  salesAdvisor: null,
  selectedLead: null,
  loaded: false,
  loading: false,
  error: null,
  unit: null,
  wishLists: null,
  purchaseQuotes: null,
  sa: null,
  brands: null,
  testDrives: null
});

const leadReducer = createReducer(
  initialState,
  on(LeadsAction.loadLeadManagements, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(LeadsAction.loadLeadManagementsSuccess, (state, { leads, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(leads, {
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
  }),
  on(LeadsAction.loadLeadManagementsFailed, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),
  on(LeadsAction.SetLeadManagementsPage, (state, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...initialState,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    });
  }),
  on(LeadsAction.ChangeLeadManagementsPage, (state, { payload }) => {
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
  on(LeadsAction.CreateLeadManagementSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: false,
      error: null,
    });
  }),
  on(LeadsAction.UpdateLeadManagementSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      selectedLead: {
        ...state.selectedLead,
        ...payload.changes
      }
    });
  }),
  on(
    LeadsAction.CreateLeadManagement,
    LeadsAction.UpdateLeadManagement,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(LeadsAction.SetLeadManagementsFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: ILead.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters,
    };
  }),
  on(
    LeadsAction.GetLeadManagementFail,
    LeadsAction.UpdateLeadManagementFail,
    LeadsAction.CreateLeadManagementFail,
    LeadsAction.CreateLeadNoteFail,
    LeadsAction.UpdateLeadNoteFail,
    LeadsAction.GetWishListFail,
    LeadsAction.GetPurchaseQuoteFail,
    LeadsAction.GetTestDriveFail,
    LeadsAction.SendManualInvitationFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),
  on(LeadsAction.GetLeadManagement, (state, { payload }) => {
    return {
      ...state,
      error: null,
      uuid: payload,
    };
  }),
  on(LeadsAction.GetLeadManagementSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedLead: payload,
      error: null,
    })
  ),
  on(LeadsAction.SendManualInvitation, (state, { payload }) => {
    return {
      ...state,
      error: null,
      uuid: payload,
    };
  }),
  on(LeadsAction.SendManualInvitationSuccess, (state)  => {
    return {
      ...state,
      error: null,
    };
  }
  ),
  on(LeadsAction.ResetSelectedLeadManagement, (state) => {
    return {
      ...state,
      selectedLead: null,
    };
  }),
  on(LeadsAction.ResetSalesAdvisor, (state) => {
    return {
      ...state,
      salesAdvisor: null,
    };
  }),
  on(LeadsAction.GetSalesAdvisor, (state, { payload }) => {
    return {
      ...state,
      error: null,
      sa: payload,
    };
  }),
  on(LeadsAction.GetSalesAdvisorSuccess, (state, { payload }) => {
    const salesAdvisor = payload;
    return {
      ...state,
      salesAdvisor,
    };
  }),
  on(LeadsAction.GetWishList, (state, { payload }) => {
    return {
      ...state,
      error: null,
      uuid: payload,
    };
  }),
  on(LeadsAction.GetWishListSuccess, (state, { payload }) => {
    const wishLists = payload;
    return {
      ...state,
      wishLists,
    };
  }),
  on(LeadsAction.GetPurchaseQuote, (state, { payload }) => {
    return {
      ...state,
      error: null,
      uuid: payload,
    };
  }),
  on(LeadsAction.GetPurchaseQuoteSuccess, (state, { payload }) => {
    const purchaseQuotes = payload;
    return {
      ...state,
      purchaseQuotes,
    };
  }),
  on(LeadsAction.GetTestDrive, (state, { payload }) => {
    return {
      ...state,
      error: null,
      uuid: payload,
    };
  }),
  on(LeadsAction.GetTestDriveSuccess, (state, { payload }) => {
    const testDrives = payload;
    return {
      ...state,
      testDrives,
    };
  }),
  on(LeadsAction.GetGlobalBrandsSuccess, (state, { payload }) => {
    const brands = payload;
    return {
      ...state,
      brands,
    };
  }),
  on(LeadsAction.CreateLeadNoteSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: false,
      error: null,
      selectedLead: {
        ...state.selectedLead,
        ...payload
      }
    });
  }),
  on(LeadsAction.UpdateLeadNoteSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      selectedLead: {
        ...state.selectedLead,
        ...payload.changes
      }
    });
  }),
  on(
    LeadsAction.DeleteLeadNoteSuccess,
    (state, { payload }) =>
      adapter.removeOne(payload.uuid, {
        total: state.total - 1,
        ...state,
        loading: false,
        error: null,
        selectedLead: {
          ...state.selectedLead,
          ...payload
        }
      })
  ),
);

export function reducer(
  state: ILeadManagementsState | undefined,
  action: Action
) {
  return leadReducer(state, action);
}

const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal,
  } = adapter.getSelectors();
  
  // select the array of Leads uuids
  export const selectLeadManagementsUuids = selectIds;
  
  // select the dictionary of Leads entities
  export const selectLeadManagementsEntities = selectEntities;
  
  // select the array of Leads
  export const selectAllLeadManagements = selectAll;
  
  // select the total Leads count
  export const selectLeadManagementsTotal = selectTotal;
