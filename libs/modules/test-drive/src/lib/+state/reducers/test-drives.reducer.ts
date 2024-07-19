import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { TestDrivesActions } from '../actions';

import { ITestDrives } from '../../models';

import { Auth } from '@neural/auth';
import { IBranches } from '@neural/modules/customer/corporate';

export interface TestDrivesState extends EntityState<ITestDrives.IDocument> {
  total: number;
  saleAdvisors: Auth.IAccount[];
  testDriveCalendar: ITestDrives.ITestDriveCalendar[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedTestDrive: ITestDrives.IDocument;
  sorts: ITestDrives.ISort;
  loaded: boolean;
  loading: boolean;
  error: any;
  selectedBranch: IBranches.IDocument;
}

export const adapter: EntityAdapter<ITestDrives.IDocument> = createEntityAdapter<
  ITestDrives.IDocument
>({
  selectId: (testDrive) => testDrive.uuid,
});

export const initialState: TestDrivesState = adapter.getInitialState({
  total: 0,
  saleAdvisors: null,
  testDriveCalendar: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  sorts: {
    updatedAt: -1
  },
  selectedTestDrive: null,
  loaded: false,
  loading: false,
  error: null,
  selectedBranch: null
});

const testDrivesReducer = createReducer(
  initialState,

  on(TestDrivesActions.SetTestDrivesPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...initialState,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    };
  }),

  on(TestDrivesActions.LoadTestDrives, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(TestDrivesActions.LoadTestDrivesFail, (state, { payload }) => {
    const error = payload;

    return { ...state, loading: false, loaded: false, error };
  }),

  on(
    TestDrivesActions.LoadTestDrivesSuccess,
    (state, { testDrives, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(testDrives, {
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
    TestDrivesActions.LoadTestDrivesFail,
    TestDrivesActions.CompleteTestDriveFail,
    TestDrivesActions.CancelTestDriveFail,
    TestDrivesActions.UpdateTestDriveFail,
    TestDrivesActions.GetTestDriveCalendarFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(
    TestDrivesActions.CancelTestDriveSuccess,
    TestDrivesActions.CompleteTestDriveSuccess,
    TestDrivesActions.UpdateTestDriveSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(TestDrivesActions.GetTestDriveSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedTestDrive: payload,
      error: null,
    })
  ),

  on(TestDrivesActions.ResetSelectedTestDrive, (state) => {
    return {
      ...state,
      selectedTestDrive: null,
    };
  }),

  on(
    TestDrivesActions.GetTestDriveSaleAdvisorsSuccess,
    (state, { payload }) => {
      const saleAdvisors = payload;
      return {
        ...state,
        saleAdvisors,
        error: null,
      };
    }
  ),

  on(TestDrivesActions.GetTestDriveCalendar, (state) => {
    return {
      ...state,
      testDriveCalendar: null,
    };
  }),

  on(TestDrivesActions.GetTestDriveCalendarSuccess, (state, { payload }) => {
    const testDriveCalendar = payload;
    return {
      ...state,
      testDriveCalendar,
      error: null,
    };
  }),

  on(TestDrivesActions.GetBranchSuccess, (state, { payload }) => {
    const selectedBranch = payload;
    return {
      ...state,
      selectedBranch,
      error: null
    };
  }),
);

export function reducer(
  state: TestDrivesState | undefined,
  action: TestDrivesActions.TestDrivesActionsUnion
) {
  return testDrivesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of TestDrives uuids
export const selectTestDrivesUuids = selectIds;

// select the dictionary of TestDrives entities
export const selectTestDrivesEntities = selectEntities;

// select the array of TestDrives
export const selectAllTestDrives = selectAll;

// select the total TestDrives count
export const selectTestDrivesTotal = selectTotal;
