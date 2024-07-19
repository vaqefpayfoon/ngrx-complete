import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ITestDrivesState } from '../reducers';

// Selector
import { testDrivesQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { TestDrivesActions } from '../actions';

// Model
import { ITestDrives } from '../../models';

@Injectable()
export class TestDrivesFacade {
  loading$ = this.store.select(testDrivesQuery.getTestDrivesLoading);

  loaded$ = this.store.select(testDrivesQuery.getTestDrivesLoaded);

  error$ = this.store.select(testDrivesQuery.getTestDrivesError);

  testDrives$ = this.store.select(testDrivesQuery.getAllTestDrives);

  testDrive$ = this.store.select(testDrivesQuery.getSelectedTestDrive);

  testDrivesConfig$ = this.store.select(testDrivesQuery.getTestDrivesPage);

  salesAdvisors$ = this.store.select(testDrivesQuery.getSalesAdvisors);

  total$ = this.store.select(testDrivesQuery.getTestDrivesTotal);

  testDriveCalendar$ = this.store.select(testDrivesQuery.getTestDriveCalendar);

  sorts$ = this.store.select(testDrivesQuery.getTestDrivesSorts);

  selectedBranch$ = this.store.select(testDrivesQuery.getTestDrivesBranch);

  constructor(private store: Store<ITestDrivesState>) {}

  changeTestDrivesPage(config: ITestDrives.IConfig) {
    this.store.dispatch(
      TestDrivesActions.SetTestDrivesPage({ payload: config })
    );
  }

  resetTestDrivesPage() {
    const params: ITestDrives.IConfig = {
      page: 1,
      limit: ITestDrives.Config.LIMIT,
    };
    this.store.dispatch(
      testDrivesQuery.getSelectedTestDrive({ payload: params })
    );
  }

  onComplete(payload: ITestDrives.IDocument) {
    this.store.dispatch(TestDrivesActions.CompleteTestDrive({ payload }));
  }

  onCancel(payload: ITestDrives.IDocument) {
    this.store.dispatch(TestDrivesActions.CancelTestDrive({ payload }));
  }

  onUpdate(payload: ITestDrives.IDocument) {
    this.store.dispatch(TestDrivesActions.UpdateTestDrive({ payload }));
  }

  onResetSelectedTestDrive() {
    this.store.dispatch(TestDrivesActions.ResetSelectedTestDrive());
  }

  onChangeTestDriveCalendar(payload: {filter: ITestDrives.IFilter, adtorque: boolean}) {
    this.store.dispatch(TestDrivesActions.GetTestDriveCalendar({ payload }));
  }

  onRedirect() {
    this.store.dispatch(TestDrivesActions.RedirectToTestDrives());
  }

  getTestDrive(uuid: string) {
    this.store.dispatch(TestDrivesActions.GetTestDrive({ payload: uuid }));
  }

  getTestDriveSalesAdvisors() {
    this.store.dispatch(TestDrivesActions.GetTestDriveSaleAdvisors());
  }

  onBranch(uuid: string): void {
    this.store.dispatch(TestDrivesActions.GetBranch({ payload: uuid }));
  }
}
